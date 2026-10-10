package com.shopsmart.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopsmart.model.Product;
import com.shopsmart.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.List;
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
        // Step 1: Fetch all current products from catalog
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
        String prompt = """
            You are a helpful AI shopping assistant for ShopSmart e-commerce platform.

            Available products in our catalog:
            %s

            Customer query: "%s"

            Analyze the query, extract budget and requirements, then recommend 1-3 products
            from the catalog above that best match. Only recommend products from the list above.

            Respond ONLY with valid JSON matching this exact structure:
            {
              "interpretedRequirement": "brief summary of what customer needs",
              "budget": <number or null>,
              "recommendations": [
                {
                  "productId": "exact ID from catalog",
                  "productName": "exact name from catalog",
                  "reason": "why this matches the requirement",
                  "availability": "IN_STOCK or OUT_OF_STOCK",
                  "price": <price number>
                }
              ],
              "clarifyingQuestion": "optional follow-up question or null"
            }
            """.formatted(catalogSummary, userQuery);

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
            log.error("AI Shopping Assistant error: {}", e.getMessage(), e);
            return ShoppingResponse.builder()
                .interpretedRequirement(userQuery)
                .clarifyingQuestion("Unable to process recommendation at this moment: " + e.getMessage())
                .recommendations(List.of())
                .build();
        }
    }

    private String cleanJsonResponse(String response) {
        if (response == null) return "{}";
        return response
            .replaceAll("```json\\s*", "")
            .replaceAll("```\\s*", "")
            .trim();
    }
}
