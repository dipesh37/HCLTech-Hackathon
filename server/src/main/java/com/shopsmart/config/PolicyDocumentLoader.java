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
 * Automatically seeds comprehensive policy documents into PgVector on application startup.
 * Ensures the RAG Policy Assistant has data immediately available for all hackathon questions.
 */
@Component
@Order(2)
@RequiredArgsConstructor
@Slf4j
public class PolicyDocumentLoader implements ApplicationRunner {

    private final DocumentIngestionService documentIngestionService;
    private final VectorStore vectorStore;

    private static final String LAPTOP_RETURN_POLICY = """
        Laptop Return Policy - Version 2026.1
        Section: Opened Products
        Opened laptops and personal computers can be returned within 7 days of delivery if physical damage is not present.
        All original accessories, chargers, and retail packaging must be included for a full refund.
        Phones and tablets may be returned within 15 days of delivery. Software activations and digital codes are non-refundable.
        Standard retail goods (apparel, books, accessories) carry a 30-day return window in unused condition.
        """;

    private static final String SHIPPING_POLICY = """
        Shipping Policy - Version 2026.1
        Section: Standard Delivery & SLA
        Standard national delivery timeline takes 5-7 business days. Express priority courier delivery arrives within 2-3 business days.
        Free standard shipping is provided on all orders of $50 or more for non-members.
        Section: Prime Membership Shipping
        Prime members receive unlimited free express delivery on all orders above $25. Same-day delivery is available in select metro areas.
        """;

    private static final String REFUND_POLICY = """
        Refund Policy - Version 2026.1
        Section: Refund Timeline
        Once the returned item is received and inspected at our fulfillment center, refunds are processed within 5-7 business days.
        The refund is credited back to the original payment method.
        Direct bank transfers may require an additional 3-5 business days for the financial institution to reflect the funds.
        Section: Partial Refunds
        Items returned after the standard window (within 45 days) may qualify for partial refunds at customer support discretion.
        """;

    private static final String WARRANTY_POLICY = """
        Warranty Policy - Version 2026.1
        Section: Hardware Warranty
        All laptops and smartphones carry a 1-year manufacturer warranty covering internal hardware defects, component failure, and battery defects.
        Physical damage, accidental drops, screen cracks, and liquid ingress are excluded from warranty coverage.
        An extended 2-year warranty protection plan is available for purchase at checkout.
        """;

    private static final String CANCELLATION_POLICY = """
        Cancellation Policy - Version 2026.1
        Section: Order Cancellation & Changes
        Orders can be cancelled free of charge at any time before shipment while in PLACED or PROCESSING status.
        Once an order has SHIPPED and is in transit with the logistics carrier, it CANNOT be cancelled as the parcel is in carrier custody.
        If you wish to return an item after shipment, please accept the delivery and initiate a return within the standard 30-day return window.
        """;

    private static final String MEMBERSHIP_POLICY = """
        Membership Benefits Policy - Version 2026.1
        Section: Prime & Premium Benefits
        Prime membership includes unlimited FREE express delivery on all orders above $25, priority 30-day returns with free home pickups, early access to deals, and 2% automatic cashback.
        Premium membership includes all Prime benefits plus complimentary same-day delivery in metro regions, 5% automatic cashback, an extended 45-day return window, and a dedicated VIP support desk.
        """;

    @Override
    public void run(ApplicationArguments args) {
        try {
            var existing = vectorStore.similaritySearch(
                SearchRequest.builder()
                    .query("cancel order after shipment")
                    .topK(1)
                    .build()
            );

            if (!existing.isEmpty()) {
                log.info("Policy documents are already present in PgVector. Skipping ingestion.");
                return;
            }

            log.info("Seeding comprehensive policy documents into Neon PgVector...");
            ingestWithRetry(LAPTOP_RETURN_POLICY, "Laptop Return Policy", "Opened Products", "2026.1");
            ingestWithRetry(SHIPPING_POLICY, "Shipping Policy", "Delivery & Prime", "2026.1");
            ingestWithRetry(REFUND_POLICY, "Refund Policy", "Refund Timeline", "2026.1");
            ingestWithRetry(WARRANTY_POLICY, "Warranty Policy", "Hardware Warranty", "2026.1");
            ingestWithRetry(CANCELLATION_POLICY, "Cancellation Policy", "Order Cancellation", "2026.1");
            ingestWithRetry(MEMBERSHIP_POLICY, "Membership Policy", "Prime Benefits", "2026.1");
            log.info("Successfully ingested all 6 policy document suites into PgVector!");

        } catch (Exception e) {
            log.warn("Notice: Policy document auto-ingestion skipped or deferred: {}", e.getMessage());
        }
    }

    private void ingestWithRetry(String text, String doc, String section, String version) {
        int attempts = 0;
        while (attempts < 3) {
            try {
                documentIngestionService.ingestText(text, doc, section, version);
                return;
            } catch (Exception e) {
                attempts++;
                log.warn("Ingestion attempt {} for {} failed: {}. Retrying...", attempts, doc, e.getMessage());
                try { Thread.sleep(1000); } catch (InterruptedException ignored) {}
            }
        }
    }
}
