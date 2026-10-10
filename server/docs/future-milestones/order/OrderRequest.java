package com.shopsmart.order;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class OrderRequest {
    @NotBlank(message = "Customer email is required")
    @Email(message = "Valid email required")
    private String customerEmail;

    @NotBlank(message = "Product ID is required")
    private String productId;

    @Min(value = 1, message = "Quantity must be at least 1")
    private int quantity = 1;
}
