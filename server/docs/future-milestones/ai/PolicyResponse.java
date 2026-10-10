package com.shopsmart.ai;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PolicyResponse {
    private String answer;
    private String confidence;   // HIGH, MEDIUM, LOW
    private List<SourceDocument> sources;
    private boolean followUpRequired;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SourceDocument {
        private String document;
        private String section;
        private String version;
    }
}
