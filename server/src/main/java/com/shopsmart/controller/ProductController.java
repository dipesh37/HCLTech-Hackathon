package com.shopsmart.controller;

import com.shopsmart.model.Product;
import com.shopsmart.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    /**
     * GET /api/products
     * Filter by category: /api/products?category=Electronics
     * Search by keyword: /api/products?q=laptop
     * Or both combined: /api/products?category=Electronics&q=laptop
     */
    @GetMapping
    public ResponseEntity<List<Product>> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String query) {
        String searchTerm = (q != null && !q.isBlank()) ? q : query;
        List<Product> products = productService.getProducts(category, searchTerm);
        return ResponseEntity.ok(products);
    }

    /**
     * GET /api/products/{id}
     * Retrieve single product by numeric ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /api/products/categories
     * Retrieve list of all unique product categories
     */
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(productService.getAllCategories());
    }

    /**
     * GET /api/products/search?query=laptop
     * Search products by keyword across name and description
     */
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String q) {
        String term = (query != null && !query.isBlank()) ? query : q;
        return ResponseEntity.ok(productService.searchProducts(term));
    }

    /**
     * POST /api/products
     * Add a new product to the catalogue
     */
    @PostMapping
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        Product saved = productService.saveProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
