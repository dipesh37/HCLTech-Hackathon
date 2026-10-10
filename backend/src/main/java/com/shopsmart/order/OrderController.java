package com.shopsmart.order;

import com.shopsmart.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // POST /api/orders  — place a new order
    @PostMapping
    public ResponseEntity<ApiResponse<Order>> placeOrder(@Valid @RequestBody OrderRequest request) {
        Order order = orderService.placeOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
            ApiResponse.ok("Order placed successfully", order));
    }

    // GET /api/orders/ORD-2026-01000  — track by order number
    @GetMapping("/{orderNumber}")
    public ResponseEntity<ApiResponse<Order>> trackOrder(@PathVariable String orderNumber) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getByOrderNumber(orderNumber)));
    }

    // GET /api/orders/customer/user@email.com  — all orders for a customer
    @GetMapping("/customer/{email}")
    public ResponseEntity<ApiResponse<List<Order>>> getByCustomer(@PathVariable String email) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getOrdersByEmail(email)));
    }

    // POST /api/orders/ORD-2026-01000/advance  — simulate status progression (demo)
    @PostMapping("/{orderNumber}/advance")
    public ResponseEntity<ApiResponse<Order>> advanceStatus(@PathVariable String orderNumber) {
        return ResponseEntity.ok(ApiResponse.ok("Status updated", orderService.advanceStatus(orderNumber)));
    }
}
