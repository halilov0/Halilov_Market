package com.halilov.market.catalog;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySlug(String slug);
    boolean existsBySku(String sku);
    boolean existsBySlug(String slug);
    Page<Product> findByActiveTrue(Pageable pageable);
    Page<Product> findByActiveTrueAndCategoryId(Long categoryId, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.active = true AND " +
        "(LOWER(p.nameHe) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
        " LOWER(p.sku)    LIKE LOWER(CONCAT('%', :q, '%')))")
    Page<Product> searchActive(@Param("q") String q, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.active = true AND p.categoryId = :categoryId AND " +
        "(LOWER(p.nameHe) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
        " LOWER(p.sku)    LIKE LOWER(CONCAT('%', :q, '%')))")
    Page<Product> searchActiveByCategory(@Param("categoryId") Long categoryId,
                                         @Param("q") String q,
                                         Pageable pageable);
}
