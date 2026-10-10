package com.shopsmart.service;

import com.shopsmart.model.Product;
import com.shopsmart.repository.ProductRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;

    @PostConstruct
    public void initSampleData() {
        if (productRepository.count() == 0) {
            log.info("No products found in database. Initializing 10 sample products...");
            List<Product> sampleProducts = Arrays.asList(
                Product.builder()
                    .name("Dell XPS 15 Laptop")
                    .description("15.6-inch OLED 3.5K display, Intel Core i7 13th Gen, 16GB RAM, 512GB SSD, NVIDIA RTX 4050.")
                    .category("Electronics")
                    .price(1499.99)
                    .stockQuantity(15)
                    .rating(4.8)
                    .imageUrl("https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600")
                    .brand("Dell")
                    .inStock(true)
                    .build(),
                Product.builder()
                    .name("Sony WH-1000XM5 Wireless Headphones")
                    .description("Industry-leading active noise canceling wireless Bluetooth headphones with auto NC optimizer.")
                    .category("Electronics")
                    .price(399.99)
                    .stockQuantity(40)
                    .rating(4.9)
                    .imageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600")
                    .brand("Sony")
                    .inStock(true)
                    .build(),
                Product.builder()
                    .name("Apple iPhone 15 Pro")
                    .description("Titanium design with A17 Pro chip, 48MP main camera, and Super Retina XDR display.")
                    .category("Electronics")
                    .price(999.00)
                    .stockQuantity(25)
                    .rating(4.7)
                    .imageUrl("https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600")
                    .brand("Apple")
                    .inStock(true)
                    .build(),
                Product.builder()
                    .name("Men's Premium Merino Wool Sweater")
                    .description("Ultra-soft, breathable 100% Australian merino wool crewneck sweater for cold weather.")
                    .category("Fashion")
                    .price(89.50)
                    .stockQuantity(60)
                    .rating(4.5)
                    .imageUrl("https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600")
                    .brand("UrbanClassics")
                    .inStock(true)
                    .build(),
                Product.builder()
                    .name("Women's Waterproof Hiking Jacket")
                    .description("Windproof, waterproof lightweight outdoor technical shell jacket with ventilation zippers.")
                    .category("Fashion")
                    .price(129.99)
                    .stockQuantity(35)
                    .rating(4.6)
                    .imageUrl("https://images.unsplash.com/photo-1544441893-675973e31985?w=600")
                    .brand("SummitWear")
                    .inStock(true)
                    .build(),
                Product.builder()
                    .name("Dyson V15 Detect Cordless Vacuum")
                    .description("Intelligent cordless vacuum engineered with laser illumination to reveal microscopic dust.")
                    .category("Home Appliances")
                    .price(749.99)
                    .stockQuantity(12)
                    .rating(4.8)
                    .imageUrl("https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600")
                    .brand("Dyson")
                    .inStock(true)
                    .build(),
                Product.builder()
                    .name("Breville Barista Touch Espresso Machine")
                    .description("Automated touchscreen espresso machine with integrated precision conical burr grinder.")
                    .category("Home Appliances")
                    .price(999.95)
                    .stockQuantity(8)
                    .rating(4.9)
                    .imageUrl("https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?w=600")
                    .brand("Breville")
                    .inStock(true)
                    .build(),
                Product.builder()
                    .name("Designing Data-Intensive Applications")
                    .description("Definitive guide by Martin Kleppmann on reliable, scalable, and maintainable systems.")
                    .category("Books")
                    .price(42.50)
                    .stockQuantity(100)
                    .rating(4.9)
                    .imageUrl("https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600")
                    .brand("O'Reilly")
                    .inStock(true)
                    .build(),
                Product.builder()
                    .name("Digital Blood Pressure Monitor")
                    .description("Clinically accurate upper arm blood pressure monitor with bluetooth smartphone sync.")
                    .category("Healthcare")
                    .price(59.99)
                    .stockQuantity(50)
                    .rating(4.6)
                    .imageUrl("https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600")
                    .brand("Omron")
                    .inStock(true)
                    .build(),
                Product.builder()
                    .name("Organic Fair Trade Whole Bean Coffee (2 lbs)")
                    .description("Single-origin artisanal dark roast Arabica coffee beans sustainably sourced.")
                    .category("Groceries")
                    .price(24.99)
                    .stockQuantity(85)
                    .rating(4.7)
                    .imageUrl("https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600")
                    .brand("RoastCraft")
                    .inStock(true)
                    .build()
            );
            productRepository.saveAll(sampleProducts);
            log.info("Successfully seeded {} sample products.", sampleProducts.size());
        }
    }

    public List<Product> getAllProducts(String category) {
        if (category != null && !category.trim().isEmpty()) {
            return productRepository.findByCategoryIgnoreCase(category.trim());
        }
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public List<Product> searchProducts(String query) {
        if (query == null || query.trim().isEmpty()) {
            return productRepository.findAll();
        }
        String cleanQuery = query.trim();
        return productRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(cleanQuery, cleanQuery);
    }

    public List<String> getAllCategories() {
        return productRepository.findDistinctCategories();
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }
}
