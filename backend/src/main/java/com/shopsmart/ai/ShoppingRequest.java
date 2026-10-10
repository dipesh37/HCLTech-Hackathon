package com.shopsmart.ai;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ShoppingRequest {
    @NotBlank(message = "Query cannot be empty")
    private String query;
}
