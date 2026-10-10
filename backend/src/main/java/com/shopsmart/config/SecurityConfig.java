package com.shopsmart.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Security configuration.
 * For the hackathon, we open most endpoints (permitAll) so the team can
 * demo quickly. You can tighten this later with JWT filter authentication.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())           // Disable CSRF for REST APIs
            .sessionManagement(sess -> sess
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // No sessions (JWT-based)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()     // Login/Register: open
                .requestMatchers("/api/products/**").permitAll() // Product catalog: open
                .requestMatchers("/api/ai/**").permitAll()       // AI endpoints: open for demo
                .requestMatchers("/api/documents/**").permitAll()// Document upload: open
                .anyRequest().authenticated()
            );
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Securely hashes passwords
    }
}
