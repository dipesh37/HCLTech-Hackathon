package com.shopsmart.config;

import com.shopsmart.product.Product;
import com.shopsmart.product.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

/**
 * Runs automatically when the application starts.
 * Seeds the database with sample products so the team can demo immediately
 * without needing a separate database import step.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) {
            log.info("Database already has products — skipping seed data.");
            return;
        }

        log.info("Seeding database with sample products...");

        List<Product> products = List.of(
            Product.builder().id("LAP101").name("Dell Inspiron 15").category("Laptops")
                .brand("Dell").price(new BigDecimal("899.99")).rating(new BigDecimal("4.3"))
                .stockQty(15).description("Intel Core i7, 16GB RAM, 512GB SSD. Perfect for development and AI projects.")
                .imageUrl("https://via.placeholder.com/400x300?text=Dell+Inspiron").build(),

            Product.builder().id("LAP102").name("Lenovo ThinkPad E15").category("Laptops")
                .brand("Lenovo").price(new BigDecimal("749.99")).rating(new BigDecimal("4.5"))
                .stockQty(8).description("AMD Ryzen 7, 16GB RAM, 256GB SSD. Business-grade reliability.")
                .imageUrl("https://via.placeholder.com/400x300?text=ThinkPad").build(),

            Product.builder().id("LAP103").name("MacBook Air M2").category("Laptops")
                .brand("Apple").price(new BigDecimal("1099.00")).rating(new BigDecimal("4.8"))
                .stockQty(5).description("Apple M2 chip, 8GB RAM, 256GB SSD. Ultra-thin and fast.")
                .imageUrl("https://via.placeholder.com/400x300?text=MacBook+Air").build(),

            Product.builder().id("PHN001").name("Samsung Galaxy S24").category("Phones")
                .brand("Samsung").price(new BigDecimal("799.99")).rating(new BigDecimal("4.6"))
                .stockQty(20).description("6.2-inch display, 256GB storage, 50MP camera.")
                .imageUrl("https://via.placeholder.com/400x300?text=Galaxy+S24").build(),

            Product.builder().id("PHN002").name("iPhone 15").category("Phones")
                .brand("Apple").price(new BigDecimal("999.00")).rating(new BigDecimal("4.7"))
                .stockQty(12).description("A16 Bionic chip, 128GB, ProMotion display.")
                .imageUrl("https://via.placeholder.com/400x300?text=iPhone+15").build(),

            Product.builder().id("PHN003").name("OnePlus 12").category("Phones")
                .brand("OnePlus").price(new BigDecimal("599.99")).rating(new BigDecimal("4.4"))
                .stockQty(30).description("Snapdragon 8 Gen 3, 12GB RAM, 100W fast charging.")
                .imageUrl("https://via.placeholder.com/400x300?text=OnePlus+12").build(),

            Product.builder().id("TAB001").name("iPad Air 5").category("Tablets")
                .brand("Apple").price(new BigDecimal("749.00")).rating(new BigDecimal("4.7"))
                .stockQty(10).description("M1 chip, 10.9-inch Liquid Retina display, 64GB.")
                .imageUrl("https://via.placeholder.com/400x300?text=iPad+Air").build(),

            Product.builder().id("HDC001").name("Sony WH-1000XM5").category("Headphones")
                .brand("Sony").price(new BigDecimal("349.99")).rating(new BigDecimal("4.8"))
                .stockQty(25).description("Industry-leading noise cancellation, 30-hour battery.")
                .imageUrl("https://via.placeholder.com/400x300?text=Sony+XM5").build(),

            Product.builder().id("BKS001").name("Clean Code").category("Books")
                .brand("Robert Martin").price(new BigDecimal("39.99")).rating(new BigDecimal("4.9"))
                .stockQty(50).description("A handbook of agile software craftsmanship.")
                .imageUrl("https://via.placeholder.com/400x300?text=Clean+Code").build(),

            Product.builder().id("BKS002").name("Spring Boot in Action").category("Books")
                .brand("Craig Walls").price(new BigDecimal("44.99")).rating(new BigDecimal("4.6"))
                .stockQty(35).description("Practical guide to building Spring Boot applications.")
                .imageUrl("https://via.placeholder.com/400x300?text=Spring+Boot").build()
        );

        productRepository.saveAll(products);
        log.info("Seeded {} products successfully.", products.size());
    }
}
