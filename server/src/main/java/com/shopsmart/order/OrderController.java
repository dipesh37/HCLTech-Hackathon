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
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<Order>> placeOrder(@Valid @RequestBody OrderRequest request) {
        Order order = orderService.placeOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
            ApiResponse.ok("Order placed successfully", order));
    }

    @GetMapping("/{orderNumber}")
    public ResponseEntity<ApiResponse<Order>> trackOrder(@PathVariable String orderNumber) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getByOrderNumber(orderNumber)));
    }

    @GetMapping("/customer/{email}")
    public ResponseEntity<ApiResponse<List<Order>>> getByCustomer(@PathVariable String email) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getOrdersByEmail(email)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrders() {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getAllOrders()));
    }

    @PostMapping("/{orderNumber}/advance")
    public ResponseEntity<ApiResponse<Order>> advanceStatus(@PathVariable String orderNumber) {
        return ResponseEntity.ok(ApiResponse.ok("Status updated", orderService.advanceStatus(orderNumber)));
    }

    @PostMapping("/{orderNumber}/cancel")
    public ResponseEntity<ApiResponse<Order>> cancelOrder(@PathVariable String orderNumber) {
        return ResponseEntity.ok(ApiResponse.ok("Order cancelled", orderService.cancelOrder(orderNumber)));
    }
}
