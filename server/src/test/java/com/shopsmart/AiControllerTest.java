package com.shopsmart;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopsmart.ai.*;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.vectorstore.VectorStore;

import java.util.List;

import static org.mockito.ArgumentMatchers.anyString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {
    "spring.autoconfigure.exclude=org.springframework.ai.vectorstore.pgvector.autoconfigure.PgVectorStoreAutoConfiguration"
})
@AutoConfigureMockMvc
class AiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private VectorStore vectorStore;

    @MockBean
    private ChatClient.Builder chatClientBuilder;

    @MockBean
    private KnowledgeAssistantService knowledgeAssistantService;

    @MockBean
    private ShoppingAssistantService shoppingAssistantService;

    @Test
    void testPolicyAssistantEndpoint() throws Exception {
        PolicyResponse mockResponse = PolicyResponse.builder()
                .answer("Opened laptops can be returned within 7 days.")
                .confidence("HIGH")
                .sources(List.of(PolicyResponse.SourceDocument.builder()
                        .document("Return Policy")
                        .section("Electronics Returns")
                        .version("2026.1")
                        .build()))
                .followUpRequired(false)
                .build();

        Mockito.when(knowledgeAssistantService.answerQuestion(anyString()))
                .thenReturn(mockResponse);

        PolicyRequest request = PolicyRequest.builder()
                .question("Can I return an opened laptop?")
                .build();

        mockMvc.perform(post("/api/ai/policy-assistant")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.answer").value("Opened laptops can be returned within 7 days."))
                .andExpect(jsonPath("$.data.confidence").value("HIGH"))
                .andExpect(jsonPath("$.data.sources[0].section").value("Electronics Returns"));
    }

    @Test
    void testShoppingAssistantEndpoint() throws Exception {
        ShoppingResponse mockResponse = ShoppingResponse.builder()
                .interpretedRequirement("Laptop under $1000")
                .budget(1000.0)
                .recommendations(List.of(ShoppingResponse.ProductRecommendation.builder()
                        .productId("1")
                        .productName("Dell XPS 15")
                        .reason("High performance laptop")
                        .availability("IN_STOCK")
                        .price(899.99)
                        .build()))
                .build();

        Mockito.when(shoppingAssistantService.getRecommendations(anyString()))
                .thenReturn(mockResponse);

        ShoppingRequest request = ShoppingRequest.builder()
                .query("Suggest a laptop under $1000")
                .build();

        mockMvc.perform(post("/api/ai/shopping-assistant")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.recommendations[0].productName").value("Dell XPS 15"));
    }
}
