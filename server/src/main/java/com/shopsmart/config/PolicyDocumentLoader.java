package com.shopsmart.config;

import com.shopsmart.ai.DocumentIngestionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Automatically seeds policy documents into PgVector on application startup.
 * Ensures the RAG Policy Assistant has data immediately available.
 */
@Component
@Order(2)
@RequiredArgsConstructor
@Slf4j
public class PolicyDocumentLoader implements ApplicationRunner {

    private final DocumentIngestionService documentIngestionService;
    private final VectorStore vectorStore;

    private static final String RETURN_POLICY = """
        Return Policy - Version 2026.1
        Section: Electronics Returns
        Opened laptops can be returned within 7 days if no physical damage is present and all original accessories are included.
        Phones and tablets may be returned within 15 days of delivery. Software products are non-refundable once activated.
        Standard items (apparel, books, accessories) can be returned within 30 days in original, unused condition.
        """;

    private static final String SHIPPING_POLICY = """
        Shipping Policy - Version 2026.1
        Section: Standard Delivery
        Standard delivery takes 5-7 business days across all regions. Express delivery takes 2-3 business days.
        Free standard shipping is provided on all orders above $50.
        Section: Prime Membership Shipping
        Prime members receive free express shipping on orders above $25. Same-day delivery is available in select metro cities.
        """;

    private static final String REFUND_POLICY = """
        Refund Policy - Version 2026.1
        Section: Refund Timeline
        Refunds are processed within 5-7 business days after returned items are received and inspected.
        Refunds are credited to the original payment method.
        Direct bank transfers may take an additional 3-5 business days to reflect.
        Section: Partial Refunds
        Items returned after the 30-day window (within 45 days) may qualify for partial refunds at support team discretion.
        """;

    private static final String WARRANTY_POLICY = """
        Warranty Policy - Version 2026.1
        Section: Laptop Warranty
        All laptops carry a 1-year manufacturer warranty covering internal hardware defects.
        Accidental physical damage, liquid spills, and software issues are NOT covered.
        An extended 2-year warranty can be purchased at checkout for additional protection.
        Section: Smartphone Warranty
        Smartphones carry a 1-year manufacturer warranty covering device components and battery defects. Screen cracks are excluded.
        """;

    @Override
    public void run(ApplicationArguments args) {
        try {
            // Check if documents are already ingested to avoid duplicate embeddings
            var existing = vectorStore.similaritySearch(
                SearchRequest.builder()
                    .query("return policy")
                    .topK(1)
                    .similarityThreshold(0.8)
                    .build()
            );

            if (!existing.isEmpty()) {
                log.info("Policy documents are already seeded in PgVector. Skipping ingestion.");
                return;
            }

            log.info("Ingesting policy documents into PgVector...");
            documentIngestionService.ingestText(RETURN_POLICY, "Return Policy", "Electronics Returns", "2026.1");
            documentIngestionService.ingestText(SHIPPING_POLICY, "Shipping Policy", "Delivery & Prime", "2026.1");
            documentIngestionService.ingestText(REFUND_POLICY, "Refund Policy", "Refund Timeline", "2026.1");
            documentIngestionService.ingestText(WARRANTY_POLICY, "Warranty Policy", "Hardware Warranty", "2026.1");
            log.info("Successfully ingested all policy documents into PgVector!");

        } catch (Exception e) {
            log.warn("Notice: Policy document auto-ingestion skipped or deferred (VectorStore not active yet): {}", e.getMessage());
        }
    }
}
