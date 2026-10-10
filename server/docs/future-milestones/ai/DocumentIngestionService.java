package com.shopsmart.ai;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.ai.reader.pdf.PagePdfDocumentReader;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Handles loading policy documents into the PgVector database.
 *
 * What "ingesting" means:
 * 1. Read the PDF/text file
 * 2. Split it into small overlapping chunks (~500 tokens each)
 * 3. Send each chunk to Gemini embedding model → get a vector (list of 768 numbers)
 * 4. Store: (chunk text + metadata + vector) in PgVector table
 *
 * After ingestion, KnowledgeAssistantService can search these vectors.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentIngestionService {

    private final VectorStore vectorStore;

    public int ingestPdf(Resource pdfResource, String documentName, String version) {
        log.info("Ingesting document: {}", documentName);

        try {
            // Step 1: Read the PDF
            PagePdfDocumentReader reader = new PagePdfDocumentReader(pdfResource);
            List<Document> rawDocs = reader.get();

            // Step 2: Split into chunks
            // - chunkSize=800: each chunk is ~800 tokens (roughly 600 words)
            // - overlap=100: chunks overlap by 100 tokens (so context isn't lost at boundaries)
            TokenTextSplitter splitter = new TokenTextSplitter(800, 100, 5, 5000, true);
            List<Document> chunks = splitter.apply(rawDocs);

            // Step 3: Add metadata to each chunk (used for source citations)
            chunks.forEach(chunk -> {
                chunk.getMetadata().put("source", documentName);
                chunk.getMetadata().put("version", version);
            });

            // Step 4: Store in PgVector (Spring AI handles embedding generation automatically)
            vectorStore.add(chunks);

            log.info("Successfully ingested {} chunks from '{}'", chunks.size(), documentName);
            return chunks.size();

        } catch (Exception e) {
            log.error("Failed to ingest document {}: {}", documentName, e.getMessage(), e);
            throw new RuntimeException("Document ingestion failed: " + e.getMessage(), e);
        }
    }

    public int ingestText(String text, String documentName, String section, String version) {
        Document doc = new Document(text, Map.of(
            "source", documentName,
            "section", section,
            "version", version
        ));

        TokenTextSplitter splitter = new TokenTextSplitter(800, 100, 5, 5000, true);
        List<Document> chunks = splitter.apply(List.of(doc));
        vectorStore.add(chunks);
        return chunks.size();
    }
}
