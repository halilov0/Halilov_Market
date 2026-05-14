package com.halilov.market.catalog;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CatalogService {

    private final CategoryRepository categories;
    private final ProductRepository products;

    public CatalogService(CategoryRepository categories, ProductRepository products) {
        this.categories = categories;
        this.products = products;
    }

    public List<CatalogDtos.CategoryView> listCategories() {
        return categories.findAllByOrderBySortOrderAscNameHeAsc()
            .stream().map(CatalogDtos.CategoryView::from).toList();
    }

    public Page<CatalogDtos.ProductView> listPublic(Long categoryId, String q, int page, int size) {
        var pageable = PageRequest.of(page, Math.min(size, 100), Sort.by("createdAt").descending());
        String trimmed = q == null ? null : q.trim();
        boolean hasQuery = trimmed != null && !trimmed.isEmpty();

        Page<Product> p;
        if (hasQuery && categoryId != null) {
            p = products.searchActiveByCategory(categoryId, trimmed, pageable);
        } else if (hasQuery) {
            p = products.searchActive(trimmed, pageable);
        } else if (categoryId != null) {
            p = products.findByActiveTrueAndCategoryId(categoryId, pageable);
        } else {
            p = products.findByActiveTrue(pageable);
        }
        return p.map(CatalogDtos.ProductView::from);
    }

    public CatalogDtos.ProductView getBySlug(String slug) {
        Product p = products.findBySlug(slug)
            .filter(Product::isActive)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "product not found"));
        return CatalogDtos.ProductView.from(p);
    }

    // ---- admin ----

    @Transactional
    public CatalogDtos.CategoryView createCategory(CatalogDtos.CategoryUpsert req) {
        if (categories.existsBySlug(req.slug())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "slug taken");
        }
        Category c = new Category();
        applyCategory(c, req);
        return CatalogDtos.CategoryView.from(categories.save(c));
    }

    @Transactional
    public CatalogDtos.CategoryView updateCategory(Long id, CatalogDtos.CategoryUpsert req) {
        Category c = categories.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "category not found"));
        if (!c.getSlug().equals(req.slug()) && categories.existsBySlug(req.slug())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "slug taken");
        }
        applyCategory(c, req);
        return CatalogDtos.CategoryView.from(c);
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (!categories.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "category not found");
        }
        categories.deleteById(id);
    }

    @Transactional
    public CatalogDtos.ProductView createProduct(CatalogDtos.ProductUpsert req) {
        if (products.existsBySku(req.sku())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "sku taken");
        }
        if (products.existsBySlug(req.slug())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "slug taken");
        }
        Product p = new Product();
        applyProduct(p, req);
        return CatalogDtos.ProductView.from(products.save(p));
    }

    @Transactional
    public CatalogDtos.ProductView updateProduct(Long id, CatalogDtos.ProductUpsert req) {
        Product p = products.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "product not found"));
        if (!p.getSku().equals(req.sku()) && products.existsBySku(req.sku())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "sku taken");
        }
        if (!p.getSlug().equals(req.slug()) && products.existsBySlug(req.slug())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "slug taken");
        }
        applyProduct(p, req);
        return CatalogDtos.ProductView.from(p);
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!products.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "product not found");
        }
        products.deleteById(id);
    }

    private void applyCategory(Category c, CatalogDtos.CategoryUpsert req) {
        c.setSlug(req.slug());
        c.setNameHe(req.nameHe());
        c.setParentId(req.parentId());
        c.setSortOrder(req.sortOrder());
    }

    private void applyProduct(Product p, CatalogDtos.ProductUpsert req) {
        p.setSku(req.sku());
        p.setSlug(req.slug());
        p.setNameHe(req.nameHe());
        p.setDescriptionHe(req.descriptionHe());
        p.setCategoryId(req.categoryId());
        p.setPriceAgorot(req.priceAgorot());
        p.setStockQty(req.stockQty());
        p.setImageUrl(req.imageUrl());
        p.setActive(req.active());
    }
}
