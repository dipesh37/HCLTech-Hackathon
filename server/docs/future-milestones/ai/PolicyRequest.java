package com.shopsmart.ai;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PolicyRequest {
    @NotBlank(message = "Question cannot be empty")
    private String question;
}
