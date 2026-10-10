package com.shopsmart.order;

import com.shopsmart.common.ResourceNotFoundException;
import com.shopsmart.model.Product;
import com.shopsmart.service.ProductService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductService productService;
    private static final AtomicLong counter = new AtomicLong(1001);

    @PostConstruct
    public void seedDemoOrders() {
        if (orderRepository.count() == 0) {
            log.info("Seeding demo orders for order tracking simulation...");
            productService.getProductById(1L).ifPresent(p -> {
                Order order1 = Order.builder()
                    .orderNumber("ORD-2026-00101")
                    .customerEmail("alex.dev@shopsmart.io")
                    .customerName("Alex Chen")
                    .product(p)
                    .productName(p.getName())
                    .productImage(p.getImageUrl())
                    .quantity(1)
                    .totalPrice(p.getPrice())
                    .status(OrderStatus.SHIPPED)
                    .shippingAddress("42 Silicon Parkway, San Francisco, CA")
                    .trackingInfo("Package departed Oakland sorting hub. Out for delivery with carrier ShopSmart Express. Tracking ID: SS-948102.")
                    .build();
                orderRepository.save(order1);
            });

            productService.getProductById(2L).ifPresent(p -> {
                Order order2 = Order.builder()
                    .orderNumber("ORD-2026-00102")
                    .customerEmail("clara.buyer@shopsmart.io")
                    .customerName("Clara Vance")
                    .product(p)
                    .productName(p.getName())
                    .productImage(p.getImageUrl())
                    .quantity(1)
                    .totalPrice(p.getPrice())
                    .status(OrderStatus.PROCESSING)
                    .shippingAddress("104 Market Street, Seattle, WA")
                    .trackingInfo("Order confirmed. Goods are being picked and packed at Regional Warehouse #2.")
                    .build();
                orderRepository.save(order2);
            });
            log.info("Demo orders seeded successfully.");
        }
    }

    public Order placeOrder(OrderRequest request) {
        Product product = productService.getProductById(request.getProductId())
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        if (product.getStockQuantity() < request.getQuantity()) {
            throw new IllegalStateException("Insufficient stock for: " + product.getName());
        }

        double total = product.getPrice() * request.getQuantity();
        String orderNum = "ORD-2026-" + String.format("%05d", counter.getAndIncrement());

        Order order = Order.builder()
            .orderNumber(orderNum)
            .customerEmail(request.getCustomerEmail())
            .customerName(request.getCustomerName() != null ? request.getCustomerName() : "Valued Customer")
            .product(product)
            .productName(product.getName())
            .productImage(product.getImageUrl())
            .quantity(request.getQuantity())
            .totalPrice(total)
            .status(OrderStatus.PLACED)
            .shippingAddress(request.getShippingAddress() != null ? request.getShippingAddress() : "Standard Address")
            .trackingInfo("Order received successfully. Preparing items for fulfillment.")
            .build();

        // Decrement stock
        product.setStockQuantity(product.getStockQuantity() - request.getQuantity());
        productService.saveProduct(product);

        return orderRepository.save(order);
    }

    public Order getByOrderNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderNumber));
    }

    public List<Order> getOrdersByEmail(String email) {
        return orderRepository.findByCustomerEmailOrderByCreatedAtDesc(email);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public Order advanceStatus(String orderNumber) {
        Order order = getByOrderNumber(orderNumber);
        switch (order.getStatus()) {
            case PLACED -> {
                order.setStatus(OrderStatus.PROCESSING);
                order.setTrackingInfo("Order is being carefully packed at our sustainable regional warehouse.");
            }
            case PROCESSING -> {
                order.setStatus(OrderStatus.SHIPPED);
                order.setTrackingInfo("Package dispatched with Express Courier! Expected delivery today by 6:00 PM.");
            }
            case SHIPPED -> {
                order.setStatus(OrderStatus.DELIVERED);
                order.setTrackingInfo("Delivered! Package safely placed at front porch / reception desk.");
            }
            case DELIVERED -> {
                // Already at final stage
            }
            default -> throw new IllegalStateException("Cannot advance order with status: " + order.getStatus());
        }
        return orderRepository.save(order);
    }

    public Order cancelOrder(String orderNumber) {
        Order order = getByOrderNumber(orderNumber);
        if (order.getStatus() == OrderStatus.SHIPPED || order.getStatus() == OrderStatus.DELIVERED) {
            throw new IllegalStateException("Order cannot be cancelled once shipped. Please return within standard policy window upon receipt.");
        }
        order.setStatus(OrderStatus.CANCELLED);
        order.setTrackingInfo("Order cancelled by customer. Automated refund processed to original payment method.");
        return orderRepository.save(order);
    }
}
