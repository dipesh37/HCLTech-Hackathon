package com.shopsmart.ai;

import com.shopsmart.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AiController {

    private final ShoppingAssistantService shoppingAssistantService;
    private final KnowledgeAssistantService knowledgeAssistantService;
    private final DocumentIngestionService documentIngestionService;

    /**
     * POST /api/ai/shopping-assistant
     * Recommends products based on user query and budget
     */
    @PostMapping("/shopping-assistant")
    public ResponseEntity<ApiResponse<ShoppingResponse>> getRecommendations(
            @Valid @RequestBody ShoppingRequest request) {
        ShoppingResponse response = shoppingAssistantService.getRecommendations(request.getQuery());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    /**
     * POST /api/ai/policy-assistant
     * RAG Policy Assistant that answers questions using PgVector similarity search
     */
    @PostMapping("/policy-assistant")
    public ResponseEntity<ApiResponse<PolicyResponse>> answerPolicyQuestion(
            @Valid @RequestBody PolicyRequest request) {
        PolicyResponse response = knowledgeAssistantService.answerQuestion(request.getQuestion());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    /**
     * POST /api/ai/documents/ingest
     * Ingests a policy PDF into the vector store
     */
    @PostMapping("/documents/ingest")
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
}
