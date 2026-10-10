package com.shopsmart.order;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.shopsmart.model.Product;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Simulated order for demo and tracking.
 * Status progression: PLACED -> PROCESSING -> SHIPPED -> DELIVERED
 */
@Entity
@Table(name = "orders")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_number", unique = true, nullable = false)
    private String orderNumber;         // e.g. "ORD-2026-00101"

    @Column(name = "customer_email", nullable = false)
    private String customerEmail;

    private String customerName;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id")
    private Product product;

    private String productName;

    private String productImage;

    @Column(nullable = false)
    @Builder.Default
    private Integer quantity = 1;

    @Column(name = "total_price", nullable = false)
    private Double totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @Column(name = "tracking_info", columnDefinition = "TEXT")
    private String trackingInfo;

    private String shippingAddress;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
