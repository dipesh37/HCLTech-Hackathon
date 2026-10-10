package com.shopsmart.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.vectorstore.SimpleVectorStore;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.pgvector.PgVectorStore;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;
import java.sql.Connection;

@Configuration
@Slf4j
public class VectorStoreConfig {

    @Bean
    public VectorStore vectorStore(DataSource dataSource, JdbcTemplate jdbcTemplate, EmbeddingModel embeddingModel) {
        try (Connection conn = dataSource.getConnection()) {
            String dbProduct = conn.getMetaData().getDatabaseProductName();
            if ("PostgreSQL".equalsIgnoreCase(dbProduct)) {
                log.info("Detected PostgreSQL database. Initializing PgVectorStore with 768 dimensions & HNSW index...");
                return PgVectorStore.builder(jdbcTemplate, embeddingModel)
                        .dimensions(768)
                        .distanceType(PgVectorStore.PgDistanceType.COSINE_DISTANCE)
                        .indexType(PgVectorStore.PgIndexType.HNSW)
                        .initializeSchema(true)
                        .build();
            }
        } catch (Exception e) {
            log.warn("PostgreSQL not active or unreachable: {}. Falling back to in-memory SimpleVectorStore.", e.getMessage());
        }

        log.info("Using in-memory SimpleVectorStore for RAG (offline / local development mode).");
        return SimpleVectorStore.builder(embeddingModel).build();
    }
}
