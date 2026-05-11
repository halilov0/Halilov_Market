package com.halilov.market.catalog;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String sku;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(name = "name_he", nullable = false)
    private String nameHe;

    @Column(name = "description_he", columnDefinition = "text")
    private String descriptionHe;

    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "price_agorot", nullable = false)
    private int priceAgorot;

    @Column(name = "stock_qty", nullable = false)
    private int stockQty;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    @PreUpdate
    void onUpdate() { this.updatedAt = Instant.now(); }

    public Long getId() { return id; }
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getNameHe() { return nameHe; }
    public void setNameHe(String nameHe) { this.nameHe = nameHe; }
    public String getDescriptionHe() { return descriptionHe; }
    public void setDescriptionHe(String descriptionHe) { this.descriptionHe = descriptionHe; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public int getPriceAgorot() { return priceAgorot; }
    public void setPriceAgorot(int priceAgorot) { this.priceAgorot = priceAgorot; }
    public int getStockQty() { return stockQty; }
    public void setStockQty(int stockQty) { this.stockQty = stockQty; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
