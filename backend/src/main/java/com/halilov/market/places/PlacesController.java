package com.halilov.market.places;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/places")
public class PlacesController {

    private final PlacesService places;

    public PlacesController(PlacesService places) {
        this.places = places;
    }

    @GetMapping("/cities")
    public List<String> cities(
        @RequestParam(name = "q", required = false) String q,
        @RequestParam(name = "limit", defaultValue = "10") int limit
    ) {
        return places.searchCities(q, Math.min(Math.max(limit, 1), 2000));
    }

    @GetMapping("/streets")
    public List<String> streets(
        @RequestParam("city") String city,
        @RequestParam(name = "q", required = false) String q,
        @RequestParam(name = "limit", defaultValue = "10") int limit
    ) {
        return places.searchStreets(city, q, Math.min(Math.max(limit, 1), 2000));
    }
}
