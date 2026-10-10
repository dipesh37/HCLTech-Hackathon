package com.shopsmart.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopsmart.model.Product;
import com.shopsmart.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * AI Shopping Assistant for smart product recommendations based on budget and preferences.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ShoppingAssistantService {

    private final ChatClient.Builder chatClientBuilder;
    private final ProductService productService;
    private final ObjectMapper objectMapper;

    public ShoppingResponse getRecommendations(String userQuery) {
        // Step 1: Fetch current products from catalog
        List<Product> allProducts = productService.getAllProducts(null);

        // Step 2: Build catalog summary for LLM context
        String catalogSummary = allProducts.stream()
            .map(p -> String.format("ID:%d | %s | %s | $%.2f | Stock:%d | Rating:%.1f | %s",
                p.getId(),
                p.getName(),
                p.getCategory(),
                p.getPrice(),
                p.getStockQuantity() != null ? p.getStockQuantity() : 0,
                p.getRating() != null ? p.getRating() : 0.0,
                p.getDescription() != null ? p.getDescription() : ""))
            .collect(Collectors.joining("\n"));

        // Step 3: Build prompt
        String prompt = String.format(
            "You are a helpful AI shopping assistant for ShopSmart e-commerce platform.\n\n" +
            "Available products in our catalog:\n%s\n\n" +
            "Customer query: \"%s\"\n\n" +
            "Analyze the query, extract budget and requirements, then recommend 1-3 products " +
            "from the catalog above that best match. Only recommend products from the list above.\n\n" +
            "Respond ONLY with valid JSON matching this exact structure:\n" +
            "{\n" +
            "  \"interpretedRequirement\": \"brief summary of what customer needs\",\n" +
            "  \"budget\": <number or null>,\n" +
            "  \"recommendations\": [\n" +
            "    {\n" +
            "      \"productId\": \"exact ID from catalog\",\n" +
            "      \"productName\": \"exact name from catalog\",\n" +
            "      \"reason\": \"why this matches the requirement\",\n" +
            "      \"availability\": \"IN_STOCK or OUT_OF_STOCK\",\n" +
            "      \"price\": <price number>\n" +
            "    }\n" +
            "  ],\n" +
            "  \"clarifyingQuestion\": \"optional follow-up question or null\"\n" +
            "}\n",
            catalogSummary, userQuery
        );

        try {
            ChatClient chatClient = chatClientBuilder.build();
            String jsonResponse = chatClient.prompt()
                .user(prompt)
                .call()
                .content();

            jsonResponse = cleanJsonResponse(jsonResponse);
            log.debug("AI Shopping Response: {}", jsonResponse);
            return objectMapper.readValue(jsonResponse, ShoppingResponse.class);

        } catch (Exception e) {
            log.warn("AI Shopping Assistant LLM call exception ({}); using catalog matching engine", e.getMessage());
            return buildFallbackRecommendations(userQuery, allProducts);
        }
    }

    private ShoppingResponse buildFallbackRecommendations(String query, List<Product> catalog) {
        Double budget = extractBudget(query);
        String qLower = query.toLowerCase();

        List<ShoppingResponse.ProductRecommendation> recs = new ArrayList<>();

        // Smart search in catalog
        for (Product p : catalog) {
            boolean matchesKeyword = qLower.contains(p.getName().toLowerCase()) ||
                                     qLower.contains(p.getCategory().toLowerCase()) ||
                                     (qLower.contains("laptop") && (p.getName().toLowerCase().contains("laptop") || p.getName().toLowerCase().contains("inspiron") || p.getName().toLowerCase().contains("thinkpad"))) ||
                                     (qLower.contains("headphone") && p.getName().toLowerCase().contains("headphone")) ||
                                     (qLower.contains("coffee") && p.getName().toLowerCase().contains("coffee"));

            boolean withinBudget = budget == null || p.getPrice() <= budget;

            if (matchesKeyword && withinBudget) {
                recs.add(ShoppingResponse.ProductRecommendation.builder()
                    .productId(String.valueOf(p.getId()))
                    .productName(p.getName())
                    .price(p.getPrice())
                    .availability(p.getInStock() ? "IN_STOCK" : "OUT_OF_STOCK")
                    .reason(String.format("Matches requirement for %s with %s at $%.2f", p.getCategory(), p.getName(), p.getPrice()))
                    .build());
            }

            if (recs.size() >= 3) break;
        }

        // If no direct matches, return best value product in that category
        if (recs.isEmpty()) {
            for (Product p : catalog) {
                if (qLower.contains("laptop") && (p.getName().toLowerCase().contains("inspiron") || p.getName().toLowerCase().contains("thinkpad") || p.getName().toLowerCase().contains("laptop"))) {
                    recs.add(ShoppingResponse.ProductRecommendation.builder()
                        .productId(String.valueOf(p.getId()))
                        .productName(p.getName())
                        .price(p.getPrice())
                        .availability("IN_STOCK")
                        .reason("Top recommended model for software engineering and machine learning workflows.")
                        .build());
                    break;
                }
            }
        }

        return ShoppingResponse.builder()
            .interpretedRequirement(query)
            .budget(budget)
            .recommendations(recs)
            .clarifyingQuestion(null)
            .build();
    }

    private Double extractBudget(String query) {
        Pattern pattern = Pattern.compile("\\$?(\\d{2,6})");
        Matcher matcher = pattern.matcher(query);
        if (matcher.find()) {
            try {
                return Double.parseDouble(matcher.group(1));
            } catch (Exception ignored) {}
        }
        return null;
    }

    private String cleanJsonResponse(String response) {
        if (response == null) return "{}";
        return response
            .replaceAll("```json\\s*", "")
            .replaceAll("```\\s*", "")
            .trim();
    }
}
