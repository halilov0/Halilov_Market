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
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Proxies data.gov.il CKAN datasets for Israeli cities + streets.
 * Government API is the authoritative source for delivery addresses.
 * Per-query in-memory cache cuts repeat traffic; gets reset when bounded.
 */
@Service
public class PlacesService {

    private static final Logger log = LoggerFactory.getLogger(PlacesService.class);
    private static final String CKAN_BASE = "https://data.gov.il/api/3/action/datastore_search";
    private static final int MAX_CACHE_ENTRIES = 2000;
    private static final int FETCH_LIMIT = 50;

    private final RestClient http;
    private final ObjectMapper mapper = new ObjectMapper();
    private final String citiesResource;
    private final String streetsResource;

    private final Map<String, List<String>> cityCache = new ConcurrentHashMap<>();
    private final Map<String, List<String>> streetCache = new ConcurrentHashMap<>();

    public PlacesService(
        @Value("${app.places.citiesResource:5c78e9fa-c2e2-4771-93ff-7f400a12f7ba}") String citiesResource,
        @Value("${app.places.streetsResource:1b14e41c-85b3-4c21-bdce-9fe48185ffca}") String streetsResource
    ) {
        this.citiesResource = citiesResource;
        this.streetsResource = streetsResource;
        var factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout((int) Duration.ofSeconds(4).toMillis());
        factory.setReadTimeout((int) Duration.ofSeconds(6).toMillis());
        this.http = RestClient.builder()
            .requestFactory(factory)
            .defaultHeader("accept", "application/json")
            .build();
    }

    public List<String> searchCities(String q, int limit) {
        String key = q == null ? "" : q.trim();
        if (key.isEmpty()) return List.of();
        List<String> cached = cityCache.get(key);
        if (cached != null) return cap(cached, limit);
        if (cityCache.size() > MAX_CACHE_ENTRIES) cityCache.clear();
        List<String> fetched = ckanQuery(citiesResource, key, null, "שם_ישוב");
        cityCache.put(key, fetched);
        return cap(fetched, limit);
    }

    public List<String> searchStreets(String city, String q, int limit) {
        if (city == null || city.isBlank()) return List.of();
        String cityKey = city.trim();
        String qKey = q == null ? "" : q.trim();
        String key = cityKey + "|" + qKey;
        List<String> cached = streetCache.get(key);
        if (cached != null) return cap(cached, limit);
        if (streetCache.size() > MAX_CACHE_ENTRIES) streetCache.clear();
        // Streets dataset has English field names (city_name, street_name) holding Hebrew values.
        // CKAN `q` as a JSON object does per-field LIKE (filters do exact match and the data has
        // trailing-space padding, so filters fail).
        Map<String, String> jsonQ = new LinkedHashMap<>();
        jsonQ.put("city_name", cityKey);
        if (!qKey.isEmpty()) jsonQ.put("street_name", qKey);
        List<String> fetched = ckanQueryJson(streetsResource, jsonQ, "street_name");
        streetCache.put(key, fetched);
        return cap(fetched, limit);
    }

    private List<String> ckanQuery(String resource, String q, Map<String, String> filters, String returnField) {
        StringBuilder url = new StringBuilder(CKAN_BASE);
        url.append("?resource_id=").append(resource);
        url.append("&limit=").append(FETCH_LIMIT);
        if (q != null && !q.isBlank()) {
            url.append("&q=").append(urlEnc(q));
        }
        if (filters != null && !filters.isEmpty()) {
            try {
                url.append("&filters=").append(urlEnc(mapper.writeValueAsString(filters)));
            } catch (Exception e) {
                log.warn("places: failed to serialize filters: {}", e.toString());
            }
        }
        return execAndExtract(url.toString(), returnField, resource, q);
    }

    private List<String> ckanQueryJson(String resource, Map<String, String> jsonQ, String returnField) {
        StringBuilder url = new StringBuilder(CKAN_BASE);
        url.append("?resource_id=").append(resource);
        url.append("&limit=").append(FETCH_LIMIT);
        try {
            url.append("&q=").append(urlEnc(mapper.writeValueAsString(jsonQ)));
        } catch (Exception e) {
            log.warn("places: failed to serialize jsonQ: {}", e.toString());
            return List.of();
        }
        return execAndExtract(url.toString(), returnField, resource, jsonQ.toString());
    }

    private List<String> execAndExtract(String url, String returnField, String resource, String qDesc) {
        try {
            // URI.create() bypasses RestClient's URI-template expansion, which
            // would otherwise decode-then-re-encode pre-encoded Hebrew query params
            // and mangle them (also: would treat `{` in JSON-q params as templates).
            String body = http.get().uri(URI.create(url)).retrieve().body(String.class);
            JsonNode root = mapper.readTree(body);
            JsonNode records = root.path("result").path("records");
            LinkedHashSet<String> seen = new LinkedHashSet<>();
            for (JsonNode rec : records) {
                String val = rec.path(returnField).asText("").trim();
                if (!val.isEmpty()) seen.add(val);
            }
            return new ArrayList<>(seen);
        } catch (Exception e) {
            log.warn("places: ckan query failed resource={} q={}: {}", resource, qDesc, e.toString());
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
