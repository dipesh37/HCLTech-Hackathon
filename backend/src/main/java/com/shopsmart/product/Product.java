package com.shopsmart.product;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * The Product entity. Each field here maps to a column in the 'products' table.
 * Spring JPA automatically creates the table from this class on startup.
 */
@Entity
@Table(name = "products")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @Column(length = 20)
    private String id;                  // e.g. "LAP101", "PHN001"

    @NotBlank(message = "Product name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Category is required")
    @Column(nullable = false, length = 100)
    private String category;            // "Laptops", "Phones", "Books"

    @Column(length = 100)
    private String brand;               // "Dell", "Samsung"

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull
    @DecimalMin(value = "0.0", message = "Price must be positive")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @DecimalMin("0.0") @DecimalMax("5.0")
    @Column(precision = 3, scale = 2)
    private BigDecimal rating;

    @Min(0)
    @Column(name = "stock_qty", nullable = false)
    private Integer stockQty = 0;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Convenience method used by AI assistant
    public boolean isInStock() {
        return stockQty != null && stockQty > 0;
    }
}
