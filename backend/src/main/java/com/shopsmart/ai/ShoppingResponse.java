package com.shopsmart.ai;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShoppingResponse {
    private String interpretedRequirement;
    private BigDecimal budget;
    private List<ProductRecommendation> recommendations;
    private String clarifyingQuestion;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductRecommendation {
        private String productId;
        private String productName;
        private String reason;
        private String availability;  // "IN_STOCK" or "OUT_OF_STOCK"
        private BigDecimal price;
    }
}
