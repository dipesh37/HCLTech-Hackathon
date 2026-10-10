package com.shopsmart.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * Spring Data JPA generates SQL queries automatically from method names.
 * You do NOT need to write SQL — just declare method signatures.
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, String> {

    // Find all products in a category, paged (for infinite scroll / pagination)
    Page<Product> findByCategory(String category, Pageable pageable);

    // Full-text search across name and description
    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :q, '%'))")
    Page<Product> searchByKeyword(@Param("q") String keyword, Pageable pageable);

    // Filter by category + max price (for AI assistant recommendations)
    @Query("SELECT p FROM Product p WHERE " +
           "(:category IS NULL OR p.category = :category) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "p.stockQty > 0")
    List<Product> findByCategoryAndMaxPrice(
        @Param("category") String category,
        @Param("maxPrice") BigDecimal maxPrice
    );

    // Get all distinct category names (for the filter sidebar)
    @Query("SELECT DISTINCT p.category FROM Product p ORDER BY p.category")
    List<String> findAllCategories();

    // Find products by category (used by AI to recommend)
    List<Product> findByCategoryAndPriceLessThanEqual(String category, BigDecimal maxPrice);
}
