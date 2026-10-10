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
 * Module 2: RAG-Based Policy Assistant
 *
 * How it works (RAG = Retrieval-Augmented Generation):
 * 1. User asks: "Can I return an opened laptop?"
 * 2. We convert the question into a vector (embedding)
 * 3. We search PgVector for the most similar document chunks
 * 4. We send those chunks + the question to Gemini
 * 5. Gemini answers using ONLY the retrieved chunks (no hallucination)
 * 6. We return the answer WITH the source document references
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class KnowledgeAssistantService {

    private final VectorStore vectorStore;
    private final ChatClient.Builder chatClientBuilder;

    public PolicyResponse answerQuestion(String question) {
        // Step 1: Search PgVector for the 4 most relevant document chunks
        List<Document> relevantDocs = vectorStore.similaritySearch(
            SearchRequest.builder()
                .query(question)
                .topK(4)
                .similarityThreshold(0.5)
                .build()
        );

        if (relevantDocs.isEmpty()) {
            return PolicyResponse.builder()
                .answer("I could not find information about this in our policy documents. " +
                        "Please contact customer support.")
                .confidence("LOW")
                .sources(List.of())
                .followUpRequired(true)
                .build();
        }

        // Step 2: Format retrieved chunks as context for the AI
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

        // Step 4: Ask Gemini to answer using ONLY the context
        String prompt = """
            You are a helpful customer support assistant for ShopSmart.
            Answer the customer's question using ONLY the information provided below.
            If the answer is not in the provided context, say "This information is not available in our current policy documents."
            
            Policy Context:
            %s
            
            Customer Question: %s
            
            Provide a clear, helpful answer in 2-3 sentences. Be specific and cite details from the context.
            """.formatted(context, question);

        try {
            ChatClient chatClient = chatClientBuilder.build();
            String answer = chatClient.prompt()
                .user(prompt)
                .call()
                .content();

            // Determine confidence based on similarity search quality
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
                .answer("I'm currently unable to process your question. Please try again.")
                .confidence("LOW")
                .sources(List.of())
                .followUpRequired(true)
                .build();
        }
    }
}
