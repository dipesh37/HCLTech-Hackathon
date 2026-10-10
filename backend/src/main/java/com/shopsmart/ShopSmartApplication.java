package com.shopsmart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the ShopSmart AI backend.
 * @SpringBootApplication enables auto-configuration, component scanning,
 * and configuration properties — all in one annotation.
 */
@SpringBootApplication
public class ShopSmartApplication {
    public static void main(String[] args) {
        SpringApplication.run(ShopSmartApplication.class, args);
    }
}
