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

@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentIngestionService {

    private final VectorStore vectorStore;

    public int ingestPdf(Resource pdfResource, String documentName, String version) {
        log.info("Ingesting PDF document: {}", documentName);

        try {
            PagePdfDocumentReader reader = new PagePdfDocumentReader(pdfResource);
            List<Document> rawDocs = reader.get();

            TokenTextSplitter splitter = new TokenTextSplitter(800, 100, 5, 5000, true);
            List<Document> chunks = splitter.apply(rawDocs);

            chunks.forEach(chunk -> {
                chunk.getMetadata().put("source", documentName);
                chunk.getMetadata().put("version", version);
            });

            vectorStore.add(chunks);
            log.info("Successfully ingested {} chunks from '{}'", chunks.size(), documentName);
            return chunks.size();

        } catch (Exception e) {
            log.error("Failed to ingest PDF {}: {}", documentName, e.getMessage(), e);
            throw new RuntimeException("PDF ingestion failed: " + e.getMessage(), e);
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
        log.info("Successfully ingested text section '{}' from '{}'", section, documentName);
        return chunks.size();
    }
}
