package com.shopsmart.customer;

import com.shopsmart.common.ApiResponse;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final CustomerService customerService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.getOrDefault("email", "alex.dev@shopsmart.io");
        Customer customer = customerService.findByEmail(email)
            .orElseGet(() -> customerService.register("Alex Chen", email, "pass", MembershipTier.PRIME));

        return ResponseEntity.ok(ApiResponse.ok("Login successful", Map.of(
            "token", "shopsmart_jwt_token_" + customer.getId(),
            "email", customer.getEmail(),
            "name", customer.getName(),
            "membershipTier", customer.getMembershipTier().name(),
            "address", customer.getAddress() != null ? customer.getAddress() : ""
        )));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Map<String, Object>>> register(@RequestBody Map<String, String> body) {
        String name = body.getOrDefault("name", "Valued Member");
        String email = body.get("email");
        String tierStr = body.getOrDefault("membershipTier", "BASIC");
        MembershipTier tier;
        try {
            tier = MembershipTier.valueOf(tierStr.toUpperCase());
        } catch (Exception e) {
            tier = MembershipTier.BASIC;
        }

        Customer customer = customerService.register(name, email, body.get("password"), tier);
        return ResponseEntity.ok(ApiResponse.ok("Registered successfully", Map.of(
            "token", "shopsmart_jwt_token_" + customer.getId(),
            "email", customer.getEmail(),
            "name", customer.getName(),
            "membershipTier", customer.getMembershipTier().name()
        )));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCurrentUser(
            @RequestParam(defaultValue = "alex.dev@shopsmart.io") String email) {
        Customer customer = customerService.findByEmail(email)
            .orElseGet(() -> customerService.register("Alex Chen", email, "pass", MembershipTier.PRIME));

        return ResponseEntity.ok(ApiResponse.ok(Map.of(
            "email", customer.getEmail(),
            "name", customer.getName(),
            "membershipTier", customer.getMembershipTier().name(),
            "address", customer.getAddress() != null ? customer.getAddress() : ""
        )));
    }

    @PutMapping("/tier")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateTier(@RequestBody Map<String, String> body) {
        String email = body.getOrDefault("email", "alex.dev@shopsmart.io");
        String tierStr = body.getOrDefault("membershipTier", "PRIME");
        MembershipTier tier = MembershipTier.valueOf(tierStr.toUpperCase());
        Customer customer = customerService.updateTier(email, tier);

        return ResponseEntity.ok(ApiResponse.ok("Tier updated", Map.of(
            "email", customer.getEmail(),
            "name", customer.getName(),
            "membershipTier", customer.getMembershipTier().name()
        )));
    }
}
