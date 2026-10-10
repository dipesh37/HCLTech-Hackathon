package com.shopsmart.order;

import com.shopsmart.common.ResourceNotFoundException;
import com.shopsmart.product.Product;
import com.shopsmart.product.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductService productService;
    private static final AtomicLong counter = new AtomicLong(1000);

    public Order placeOrder(OrderRequest request) {
        Product product = productService.getById(request.getProductId());

        if (product.getStockQty() < request.getQuantity()) {
            throw new IllegalStateException("Insufficient stock for: " + product.getName());
        }

        BigDecimal total = product.getPrice().multiply(BigDecimal.valueOf(request.getQuantity()));
        String orderNum = "ORD-" + LocalDateTime.now().getYear() + "-" +
                          String.format("%05d", counter.getAndIncrement());

        Order order = Order.builder()
            .orderNumber(orderNum)
            .customerEmail(request.getCustomerEmail())
            .product(product)
            .quantity(request.getQuantity())
            .totalPrice(total)
            .status(OrderStatus.PLACED)
            .trackingInfo("Order placed successfully. Processing will begin shortly.")
            .build();

        // Reduce stock (simulated)
        product.setStockQty(product.getStockQty() - request.getQuantity());
        productService.save(product);

        return orderRepository.save(order);
    }

    public Order getByOrderNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderNumber));
    }

    public List<Order> getOrdersByEmail(String email) {
        return orderRepository.findByCustomerEmailOrderByCreatedAtDesc(email);
    }

    // Simulates order status progression (for demo purposes)
    public Order advanceStatus(String orderNumber) {
        Order order = getByOrderNumber(orderNumber);
        switch (order.getStatus()) {
            case PLACED      -> { order.setStatus(OrderStatus.PROCESSING);
                                  order.setTrackingInfo("Your order is being packed at our warehouse."); }
            case PROCESSING  -> { order.setStatus(OrderStatus.SHIPPED);
                                  order.setTrackingInfo("Out for delivery! Expected today by 8 PM."); }
            case SHIPPED     -> { order.setStatus(OrderStatus.DELIVERED);
                                  order.setTrackingInfo("Delivered! Thank you for shopping with ShopSmart."); }
            default -> throw new IllegalStateException("Cannot advance from status: " + order.getStatus());
        }
        return orderRepository.save(order);
    }
}
