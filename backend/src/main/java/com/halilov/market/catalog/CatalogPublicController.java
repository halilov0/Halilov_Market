package com.halilov.market.catalog;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CatalogPublicController {

    private final CatalogService catalog;

    public CatalogPublicController(CatalogService catalog) {
        this.catalog = catalog;
    }

    @GetMapping("/api/categories")
    public List<CatalogDtos.CategoryView> categories() {
        return catalog.listCategories();
    }

    @GetMapping("/api/products")
    public Page<CatalogDtos.ProductView> products(
        @RequestParam(required = false) Long categoryId,
        @RequestParam(required = false) String q,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        return catalog.listPublic(categoryId, q, page, size);
    }

    @GetMapping("/api/products/{slug}")
    public CatalogDtos.ProductView product(@PathVariable String slug) {
        return catalog.getBySlug(slug);
    }
}
