package com.shopsmart.ai;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * RAG-Based Policy Assistant using PgVector and Spring AI
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class KnowledgeAssistantService {

    private final VectorStore vectorStore;
    private final ChatClient.Builder chatClientBuilder;

    public PolicyResponse answerQuestion(String question) {
        try {
            // Step 1: Search PgVector for the most relevant document chunks
            List<Document> relevantDocs = vectorStore.similaritySearch(
                SearchRequest.builder()
                    .query(question)
                    .topK(4)
                    .similarityThreshold(0.5)
                    .build()
            );

            if (relevantDocs.isEmpty()) {
                return PolicyResponse.builder()
                    .answer("I could not find information about this in our policy documents. Please contact customer support.")
                    .confidence("LOW")
                    .sources(List.of())
                    .followUpRequired(true)
                    .build();
            }

            // Step 2: Format retrieved chunks as context
            String context = relevantDocs.stream()
                .map(Document::getText)
                .collect(Collectors.joining("\n\n---\n\n"));

            // Step 3: Extract source metadata for citations
            List<PolicyResponse.SourceDocument> sources = relevantDocs.stream()
                .map(doc -> {
                    Map<String, Object> meta = doc.getMetadata();
                    return PolicyResponse.SourceDocument.builder()
                        .document((String) meta.getOrDefault("source", "Policy Document"))
                        .section((String) meta.getOrDefault("section", "General"))
                        .version((String) meta.getOrDefault("version", "2026.1"))
                        .build();
                })
                .distinct()
                .limit(3)
                .collect(Collectors.toList());

            // Step 4: Prompt Gemini with strictly the retrieved context
            String prompt = """
                You are a helpful customer support assistant for ShopSmart.
                Answer the customer's question using ONLY the information provided below.
                If the answer is not in the provided context, say "This information is not available in our current policy documents."

                Policy Context:
                %s

                Customer Question: %s

                Provide a clear, helpful answer in 2-3 sentences. Be specific and cite details from the context.
                """.formatted(context, question);

            ChatClient chatClient = chatClientBuilder.build();
            String answer = chatClient.prompt()
                .user(prompt)
                .call()
                .content();

            String confidence = relevantDocs.size() >= 3 ? "HIGH" :
                                relevantDocs.size() == 2 ? "MEDIUM" : "LOW";

            return PolicyResponse.builder()
                .answer(answer)
                .confidence(confidence)
                .sources(sources)
                .followUpRequired(false)
                .build();

        } catch (Exception e) {
            log.error("Policy assistant error: {}", e.getMessage(), e);
            return PolicyResponse.builder()
                .answer("Unable to process policy query at this moment: " + e.getMessage())
                .confidence("LOW")
                .sources(List.of())
                .followUpRequired(true)
                .build();
        }
    }
}
