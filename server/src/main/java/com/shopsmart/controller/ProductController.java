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
@CrossOrigin(origins = "*") // CrossOrigin allows frontend calls during hackathon development
public class ProductController {

    private final ProductService productService;

    /**
     * GET /api/products
     * Optional filter by category: /api/products?category=Electronics
     */
    @GetMapping
    public ResponseEntity<List<Product>> getProducts(@RequestParam(required = false) String category) {
        List<Product> products = productService.getAllProducts(category);
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
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String query) {
        return ResponseEntity.ok(productService.searchProducts(query));
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
