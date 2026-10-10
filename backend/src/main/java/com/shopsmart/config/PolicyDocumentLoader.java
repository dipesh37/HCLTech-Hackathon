package com.shopsmart.config;

import com.shopsmart.ai.DocumentIngestionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Loads sample policy documents into PgVector on application startup.
 * This ensures the RAG Policy Assistant has data to work with immediately.
 *
 * In production, documents would be uploaded via the /api/ai/documents/ingest endpoint.
 * For the hackathon demo, we pre-load the sample-policies.md file automatically.
 */
@Component
@Order(2)   // Runs after DataInitializer (which is a CommandLineRunner, not ApplicationRunner)
@RequiredArgsConstructor
@Slf4j
public class PolicyDocumentLoader implements ApplicationRunner {

    private final DocumentIngestionService documentIngestionService;
    private final VectorStore vectorStore;

    // Sample policy text — in real setup this comes from PDFs via the upload endpoint
    private static final String RETURN_POLICY = """
        Return Policy - Version 2026.1
        Section: Electronics Returns
        Opened laptops can be returned within 7 days if no physical damage is present and all accessories are included.
        Phones and tablets may be returned within 15 days. Software products are non-refundable.
        Standard items can be returned within 30 days in original, unused condition.
        """;

    private static final String SHIPPING_POLICY = """
        Shipping Policy - Version 2026.1
        Section: Standard Delivery
        Standard delivery takes 5-7 business days. Express delivery takes 2-3 business days.
        Free standard shipping on orders above $50.
        Section: Prime Membership Shipping
        Prime members get free express shipping on orders above $25. Same-day delivery available in metro cities.
        """;

    private static final String REFUND_POLICY = """
        Refund Policy - Version 2026.1
        Section: Refund Timeline
        Refunds are processed within 5-7 business days after item inspection.
        The refund is credited to the original payment method.
        Bank transfers may take an additional 3-5 business days.
        Section: Partial Refunds
        Items returned within 45 days may qualify for partial refunds at support team discretion.
        """;

    private static final String WARRANTY_POLICY = """
        Warranty Policy - Version 2026.1
        Section: Laptop Warranty
        All laptops carry a 1-year manufacturer warranty covering hardware defects.
        Physical damage, liquid damage, and software issues are NOT covered.
        Extended warranty (2 years) available at purchase for additional fee.
        Section: Phone Warranty
        Smartphones carry a 1-year manufacturer warranty. Screen damage from drops is not covered.
        """;

    @Override
    public void run(ApplicationArguments args) {
        try {
            // Check if documents are already loaded (avoid duplicate ingestion on restart)
            var existing = vectorStore.similaritySearch(
                org.springframework.ai.vectorstore.SearchRequest.builder()
                    .query("return policy").topK(1).similarityThreshold(0.9).build()
            );

            if (!existing.isEmpty()) {
                log.info("Policy documents already loaded in vector store — skipping.");
                return;
            }

            log.info("Loading policy documents into vector store...");
            documentIngestionService.ingestText(RETURN_POLICY, "Return Policy", "Electronics Returns", "2026.1");
            documentIngestionService.ingestText(SHIPPING_POLICY, "Shipping Policy", "Delivery", "2026.1");
            documentIngestionService.ingestText(REFUND_POLICY, "Refund Policy", "Refund Timeline", "2026.1");
            documentIngestionService.ingestText(WARRANTY_POLICY, "Warranty Policy", "Laptop Warranty", "2026.1");
            log.info("Policy documents loaded successfully.");
        } catch (Exception e) {
            log.warn("Could not load policy documents (AI may not be configured yet): {}", e.getMessage());
        }
    }
}
