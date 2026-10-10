package com.shopsmart.ai;

import com.shopsmart.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AiController {

    private final ShoppingAssistantService shoppingAssistantService;
    private final KnowledgeAssistantService knowledgeAssistantService;
    private final DocumentIngestionService documentIngestionService;

    /**
     * POST /api/ai/shopping-assistant
     * Module 1: Recommends products based on user query and budget
     */
    @PostMapping("/ai/shopping-assistant")
    public ResponseEntity<ApiResponse<ShoppingResponse>> getRecommendations(
            @Valid @RequestBody ShoppingRequest request) {
        ShoppingResponse response = shoppingAssistantService.getRecommendations(request.getQuery());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    /**
     * POST /api/ai/policy-assistant
     * Module 2: RAG Policy Assistant that answers questions using PgVector similarity search
     */
    @PostMapping("/ai/policy-assistant")
    public ResponseEntity<ApiResponse<PolicyResponse>> answerPolicyQuestion(
            @Valid @RequestBody PolicyRequest request) {
        PolicyResponse response = knowledgeAssistantService.answerQuestion(request.getQuestion());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    /**
     * POST /api/ai/documents/ingest
     * Ingests a policy PDF into the vector store
     */
    @PostMapping("/ai/documents/ingest")
    public ResponseEntity<ApiResponse<Map<String, Object>>> ingestDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("documentName") String documentName,
            @RequestParam(value = "version", defaultValue = "2026.1") String version) {
        try {
            Resource resource = file.getResource();
            int chunks = documentIngestionService.ingestPdf(resource, documentName, version);
            return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "documentName", documentName,
                "chunksCreated", chunks,
                "status", "SUCCESS"
            )));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to ingest document: " + e.getMessage()));
        }
    }

    /**
     * POST /api/documents/ingest-text
     * Ingests text/markdown policy directly into the vector store
     */
    @PostMapping("/documents/ingest-text")
    public ResponseEntity<ApiResponse<Map<String, Object>>> ingestTextDocument(
            @RequestBody Map<String, String> payload) {
        String title = payload.getOrDefault("title", "Custom Policy");
        String section = payload.getOrDefault("section", "General");
        String version = payload.getOrDefault("version", "2026.1");
        String content = payload.getOrDefault("content", "");

        if (content.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Content cannot be empty"));
        }

        int chunks = documentIngestionService.ingestText(content, title, section, version);
        return ResponseEntity.ok(ApiResponse.ok(Map.of(
            "documentName", title,
            "section", section,
            "chunksCreated", chunks,
            "status", "SUCCESS"
        )));
    }

    /**
     * GET /api/documents
     * Lists enterprise knowledge documents
     */
    @GetMapping("/documents")
    public ResponseEntity<ApiResponse<List<Map<String, String>>>> listDocuments() {
        List<Map<String, String>> docs = List.of(
            Map.of("title", "Return Policy", "category", "Returns & Refunds", "version", "2026.1", "effectiveDate", "Jan 2026", "region", "Global"),
            Map.of("title", "Refund Policy", "category", "Billing & SLA", "version", "2026.1", "effectiveDate", "Jan 2026", "region", "Global"),
            Map.of("title", "Shipping Policy", "category", "Fulfillment & Logistics", "version", "2026.1", "effectiveDate", "Jan 2026", "region", "Global"),
            Map.of("title", "Warranty Policy", "category", "Hardware Protection", "version", "2026.1", "effectiveDate", "Jan 2026", "region", "Global"),
            Map.of("title", "Membership Benefits", "category", "Customer Loyalty", "version", "2026.1", "effectiveDate", "Jan 2026", "region", "Global")
        );
        return ResponseEntity.ok(ApiResponse.ok(docs));
    }
}
