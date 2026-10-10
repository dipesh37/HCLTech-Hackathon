package com.shopsmart.customer;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomerService {

    private final CustomerRepository customerRepository;

    @PostConstruct
    public void seedDefaultCustomers() {
        if (customerRepository.count() == 0) {
            log.info("Seeding demo customer accounts for Basic, Prime, and Premium tiers...");
            customerRepository.save(Customer.builder()
                .email("alex.dev@shopsmart.io")
                .name("Alex Chen")
                .password("password123")
                .membershipTier(MembershipTier.PRIME)
                .address("42 Silicon Parkway, San Francisco, CA")
                .build());

            customerRepository.save(Customer.builder()
                .email("clara.buyer@shopsmart.io")
                .name("Clara Vance")
                .password("password123")
                .membershipTier(MembershipTier.PREMIUM)
                .address("104 Market Street, Seattle, WA")
                .build());

            customerRepository.save(Customer.builder()
                .email("guest@shopsmart.io")
                .name("Guest Shopper")
                .password("password123")
                .membershipTier(MembershipTier.BASIC)
                .address("12 Ocean Avenue, Santa Monica, CA")
                .build());
        }
    }

    public Optional<Customer> findByEmail(String email) {
        return customerRepository.findByEmail(email);
    }

    public Customer register(String name, String email, String password, MembershipTier tier) {
        if (customerRepository.existsByEmail(email)) {
            return customerRepository.findByEmail(email).get();
        }
        Customer customer = Customer.builder()
            .name(name)
            .email(email)
            .password(password != null ? password : "default123")
            .membershipTier(tier != null ? tier : MembershipTier.BASIC)
            .address("Default Delivery Address")
            .build();
        return customerRepository.save(customer);
    }

    public Customer updateTier(String email, MembershipTier newTier) {
        Customer customer = customerRepository.findByEmail(email)
            .orElseGet(() -> register("Shopper", email, "password", newTier));
        customer.setMembershipTier(newTier);
        return customerRepository.save(customer);
    }
}
