package com.shopsmart.product;

import com.shopsmart.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Handles all HTTP requests that start with /api/products
 * Each method is one REST endpoint the React frontend calls.
 */
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // GET /api/products?page=0&size=10&sortBy=price
    @GetMapping
    public ResponseEntity<ApiResponse<Page<Product>>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "name") String sortBy) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getAllProducts(page, size, sortBy)));
    }

    // GET /api/products/LAP101
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getById(id)));
    }

    // GET /api/products/search?q=laptop
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<Product>>> search(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(ApiResponse.ok(productService.searchProducts(q, page, size)));
    }

    // GET /api/products/category/Laptops?page=0&size=10
    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<Page<Product>>> getByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getByCategory(category, page, size)));
    }

    // GET /api/products/categories (returns ["Laptops", "Phones", ...])
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<String>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.ok(productService.getAllCategories()));
    }
}
