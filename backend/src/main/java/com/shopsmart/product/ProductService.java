package com.shopsmart.product;

import com.shopsmart.common.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

/**
 * All business logic for products lives here.
 * Controllers call services — services call repositories.
 * This separation keeps each class focused on one job.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;

    public Page<Product> getAllProducts(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());
        return productRepository.findAll(pageable);
    }

    public Product getById(String id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
    }

    public Page<Product> searchProducts(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.searchByKeyword(keyword, pageable);
    }

    public Page<Product> getByCategory(String category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findByCategory(category, pageable);
    }

    public List<String> getAllCategories() {
        return productRepository.findAllCategories();
    }

    // Used by AI shopping assistant: find products matching budget + category
    public List<Product> findForBudget(String category, BigDecimal maxPrice) {
        return productRepository.findByCategoryAndMaxPrice(category, maxPrice);
    }

    public Product save(Product product) {
        return productRepository.save(product);
    }
}
