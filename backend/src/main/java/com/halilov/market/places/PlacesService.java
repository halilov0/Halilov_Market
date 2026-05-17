package com.halilov.market.places;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.TreeSet;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Proxies data.gov.il CKAN datasets for Israeli cities + streets.
 *
 * Strategy: pull the FULL dataset slice once (whole cities list, then per-city
 * street list on demand), cache forever, then filter locally with substring match.
 * CKAN's own full-text `q=` tokenizes Hebrew aggressively — "תל א" matches nothing
 * because "א" is a sub-token. Local substring filtering on the cached list gives
 * the user-expected behavior and lets us return an empty-query browse list.
 */
@Service
public class PlacesService {

    private static final Logger log = LoggerFactory.getLogger(PlacesService.class);
    private static final String CKAN_BASE = "https://data.gov.il/api/3/action/datastore_search";
    /** Israel has ~1300 settlements and Tel Aviv tops the list at ~3000 streets. 10k is safe headroom. */
    private static final int FULL_FETCH_LIMIT = 10000;

    private final RestClient http;
    private final ObjectMapper mapper = new ObjectMapper();
    private final String citiesResource;
    private final String streetsResource;

    private volatile List<String> allCities;
    private final Object citiesLock = new Object();
    private final Map<String, List<String>> streetsByCity = new ConcurrentHashMap<>();

    public PlacesService(
        @Value("${app.places.citiesResource:5c78e9fa-c2e2-4771-93ff-7f400a12f7ba}") String citiesResource,
        @Value("${app.places.streetsResource:1b14e41c-85b3-4c21-bdce-9fe48185ffca}") String streetsResource
    ) {
        this.citiesResource = citiesResource;
        this.streetsResource = streetsResource;
        var factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout((int) Duration.ofSeconds(5).toMillis());
        // Full-dataset fetch (~1300 cities or ~3000 streets) needs more headroom than per-query.
        factory.setReadTimeout((int) Duration.ofSeconds(20).toMillis());
        this.http = RestClient.builder()
            .requestFactory(factory)
            .defaultHeader("accept", "application/json")
            .build();
    }

    public List<String> searchCities(String q, int limit) {
        List<String> all = ensureCities();
        return filter(all, q, limit);
    }

    public List<String> searchStreets(String city, String q, int limit) {
        if (city == null || city.isBlank()) return List.of();
        String cityKey = city.trim();
        List<String> all = streetsByCity.get(cityKey);
        if (all == null) {
            all = fetchStreetsForCity(cityKey);
            if (!all.isEmpty()) streetsByCity.put(cityKey, all);
            // empty result not cached — let next call retry in case of transient miss
        }
        return filter(all, q, limit);
    }

    /** Substring filter on the cached list. Empty q returns first `limit` entries (browse mode). */
    private static List<String> filter(List<String> source, String q, int limit) {
        if (source == null || source.isEmpty()) return List.of();
        String key = q == null ? "" : q.trim();
        if (key.isEmpty()) return cap(source, limit);
        List<String> out = new ArrayList<>();
        for (String s : source) {
            if (s.contains(key)) {
                out.add(s);
                if (out.size() >= limit) break;
            }
        }
        return out;
    }

    private List<String> ensureCities() {
        List<String> snapshot = allCities;
        if (snapshot != null) return snapshot;
        synchronized (citiesLock) {
            if (allCities != null) return allCities;
            List<String> fetched = fetchAll(citiesResource, null, "שם_ישוב");
            if (!fetched.isEmpty()) {
                Collections.sort(fetched);
                allCities = fetched;
            } else {
                // Don't memoize an empty list — let next call retry. gov.il may have been transient.
                log.warn("places: cities fetch returned empty, will retry on next call");
            }
            return fetched;
        }
    }

    private List<String> fetchStreetsForCity(String city) {
        // Streets dataset uses English field names with Hebrew values, padded with whitespace.
        // `q` as a JSON object does per-field LIKE; `filters=` does exact match and the data
        // has trailing-space padding, so filters fail.
        //
        // Dedupe: a single physical street has many records — one official entry plus
        // multiple synonyms (e.g. "רוטשילד" + "שד רוטשילד" + "שדרות רוטשילד" all share
        // `official_code`). Group by `official_code`, keep the entry where
        // `street_name_status` starts with "official" so the canonical name wins.
        Map<String, String> jsonQ = new LinkedHashMap<>();
        jsonQ.put("city_name", city);
        StringBuilder url = new StringBuilder(CKAN_BASE)
            .append("?resource_id=").append(streetsResource)
            .append("&limit=").append(FULL_FETCH_LIMIT);
        try {
            url.append("&q=").append(urlEnc(mapper.writeValueAsString(jsonQ)));
        } catch (Exception e) {
            log.warn("places: failed to serialize jsonQ for streets: {}", e.toString());
            return List.of();
        }
        try {
            String body = http.get().uri(URI.create(url.toString())).retrieve().body(String.class);
            JsonNode records = mapper.readTree(body).path("result").path("records");
            Map<String, String> byCode = new LinkedHashMap<>();
            Map<String, Boolean> isOfficialChosen = new LinkedHashMap<>();
            for (JsonNode rec : records) {
                String name = rec.path("street_name").asText("").trim();
                String code = rec.path("official_code").asText("").trim();
                if (name.isEmpty() || code.isEmpty()) continue;
                boolean official = rec.path("street_name_status").asText("").trim().startsWith("official");
                Boolean haveOfficial = isOfficialChosen.get(code);
                if (haveOfficial == null || (official && !haveOfficial)) {
                    byCode.put(code, name);
                    isOfficialChosen.put(code, official);
                }
            }
            // TreeSet sorts + collapses any cross-street display-name collisions.
            return new ArrayList<>(new TreeSet<>(byCode.values()));
        } catch (Exception e) {
            log.warn("places: streets fetch failed for {}: {}", city, e.toString());
            return List.of();
        }
    }

    private List<String> fetchAll(String resource, Map<String, String> jsonQ, String returnField) {
        StringBuilder url = new StringBuilder(CKAN_BASE);
        url.append("?resource_id=").append(resource);
        url.append("&limit=").append(FULL_FETCH_LIMIT);
        if (jsonQ != null && !jsonQ.isEmpty()) {
            try {
                url.append("&q=").append(urlEnc(mapper.writeValueAsString(jsonQ)));
            } catch (Exception e) {
                log.warn("places: failed to serialize jsonQ: {}", e.toString());
                return List.of();
            }
        }
        try {
            // URI.create() bypasses RestClient's URI-template expansion, which would otherwise
            // decode-then-re-encode pre-encoded Hebrew query params and mangle them
            // (and would treat `{` from JSON-q payloads as template variables).
            String body = http.get().uri(URI.create(url.toString())).retrieve().body(String.class);
            JsonNode root = mapper.readTree(body);
            JsonNode records = root.path("result").path("records");
            LinkedHashSet<String> seen = new LinkedHashSet<>();
            for (JsonNode rec : records) {
                String val = rec.path(returnField).asText("").trim();
                if (!val.isEmpty()) seen.add(val);
            }
            return new ArrayList<>(seen);
        } catch (Exception e) {
            log.warn("places: ckan full fetch failed resource={} q={}: {}", resource, jsonQ, e.toString());
            return List.of();
        }
    }

    private static String urlEnc(String s) {
        return URLEncoder.encode(s, StandardCharsets.UTF_8);
    }

    private static List<String> cap(List<String> list, int limit) {
        if (limit <= 0 || list.size() <= limit) return list;
        return list.subList(0, limit);
    }
}
