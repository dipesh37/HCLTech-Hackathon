package com.shopsmart.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShoppingResponse {
    private String interpretedRequirement;
    private Double budget;
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
        private String availability;
        private Double price;
    }
}
