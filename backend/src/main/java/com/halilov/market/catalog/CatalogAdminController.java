package com.halilov.market.catalog;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/catalog")
public class CatalogAdminController {

    private final CatalogService catalog;

    public CatalogAdminController(CatalogService catalog) {
        this.catalog = catalog;
    }

    @PostMapping("/categories")
    @ResponseStatus(HttpStatus.CREATED)
    public CatalogDtos.CategoryView createCategory(@Valid @RequestBody CatalogDtos.CategoryUpsert req) {
        return catalog.createCategory(req);
    }

    @PutMapping("/categories/{id}")
    public CatalogDtos.CategoryView updateCategory(@PathVariable Long id, @Valid @RequestBody CatalogDtos.CategoryUpsert req) {
        return catalog.updateCategory(id, req);
    }

    @DeleteMapping("/categories/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategory(@PathVariable Long id) {
        catalog.deleteCategory(id);
    }

    @PostMapping("/products")
    @ResponseStatus(HttpStatus.CREATED)
    public CatalogDtos.ProductView createProduct(@Valid @RequestBody CatalogDtos.ProductUpsert req) {
        return catalog.createProduct(req);
    }

    @PutMapping("/products/{id}")
    public CatalogDtos.ProductView updateProduct(@PathVariable Long id, @Valid @RequestBody CatalogDtos.ProductUpsert req) {
        return catalog.updateProduct(id, req);
    }

    @DeleteMapping("/products/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable Long id) {
        catalog.deleteProduct(id);
    }
}
