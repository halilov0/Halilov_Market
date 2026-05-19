package com.halilov.online.catalog;

import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;

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

    @GetMapping(value = "/products.csv", produces = "text/csv; charset=UTF-8")
    public ResponseEntity<String> exportProductsCsv() {
        String csv = catalog.exportProductsCsv();
        String filename = "products-" + LocalDate.now() + ".csv";
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
            .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
            .body(csv);
    }

    @PostMapping(value = "/products/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public CatalogDtos.ImportResult importProductsCsv(@RequestParam("file") MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new org.springframework.web.server.ResponseStatusException(
                HttpStatus.BAD_REQUEST, "missing file");
        }
        return catalog.importProductsCsv(file.getInputStream());
    }
}
