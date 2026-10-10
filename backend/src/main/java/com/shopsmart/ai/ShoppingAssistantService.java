package com.shopsmart.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopsmart.product.Product;
import com.shopsmart.product.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Module 1: AI Shopping Assistant
 *
 * How it works:
 * 1. User sends: "Suggest a laptop under $1000 for Java development"
 * 2. We fetch matching products from our database first
 * 3. We send those products + the user query to Gemini
 * 4. Gemini returns a structured recommendation in JSON
 * 5. We parse and return that to the frontend
 *
 * This approach (fetching from DB first, then sending to AI) ensures:
 * - AI only recommends products that actually exist in our system
 * - AI cannot hallucinate product IDs or prices
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ShoppingAssistantService {

    private final ChatClient.Builder chatClientBuilder;
    private final ProductService productService;
    private final ObjectMapper objectMapper;

    public ShoppingResponse getRecommendations(String userQuery) {
        // Step 1: Fetch ALL products from DB (for small catalogs) or search by keyword
        List<Product> allProducts = productService.getAllProducts(0, 50, "name").getContent();

        // Step 2: Build a catalog summary to give to the AI
        String catalogSummary = allProducts.stream()
            .map(p -> String.format("ID:%s | %s | %s | $%.2f | Stock:%d | Rating:%.1f",
                p.getId(), p.getName(), p.getCategory(), p.getPrice(),
                p.getStockQty(), p.getRating() != null ? p.getRating().doubleValue() : 0.0))
            .collect(Collectors.joining("\n"));

        // Step 3: Build the prompt for Gemini
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

            // Clean markdown code fences if AI wraps JSON in ```json blocks
            jsonResponse = cleanJsonResponse(jsonResponse);

            log.debug("AI Response: {}", jsonResponse);
            return objectMapper.readValue(jsonResponse, ShoppingResponse.class);

        } catch (Exception e) {
            log.error("AI Shopping Assistant error: {}", e.getMessage(), e);
            return ShoppingResponse.builder()
                .interpretedRequirement(userQuery)
                .clarifyingQuestion("I'm having trouble processing your request. Please try again.")
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
