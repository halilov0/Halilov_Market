package com.halilov.market.catalog;

import jakarta.validation.constraints.*;

public class CatalogDtos {

    public record CategoryView(Long id, String slug, String nameHe, Long parentId, int sortOrder) {
        static CategoryView from(Category c) {
            return new CategoryView(c.getId(), c.getSlug(), c.getNameHe(), c.getParentId(), c.getSortOrder());
        }
    }

    public record CategoryUpsert(
        @NotBlank @Size(max = 128) String slug,
        @NotBlank @Size(max = 255) String nameHe,
        Long parentId,
        @Min(0) int sortOrder
    ) {}

    public record ProductView(
        Long id, String sku, String slug, String nameHe, String descriptionHe,
        Long categoryId, int priceAgorot, int stockQty, String imageUrl, boolean active
    ) {
        static ProductView from(Product p) {
            return new ProductView(
                p.getId(), p.getSku(), p.getSlug(), p.getNameHe(), p.getDescriptionHe(),
                p.getCategoryId(), p.getPriceAgorot(), p.getStockQty(), p.getImageUrl(), p.isActive()
            );
        }
    }

    public record ProductUpsert(
        @NotBlank @Size(max = 64) String sku,
        @NotBlank @Size(max = 255) String slug,
        @NotBlank @Size(max = 255) String nameHe,
        @Size(max = 10000) String descriptionHe,
        Long categoryId,
        @Min(0) int priceAgorot,
        @Min(0) int stockQty,
        @Size(max = 1024) String imageUrl,
        boolean active
    ) {}
}
