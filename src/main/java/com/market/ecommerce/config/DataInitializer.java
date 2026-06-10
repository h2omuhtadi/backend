package com.market.ecommerce.config;

import com.market.ecommerce.entity.User;
import com.market.ecommerce.entity.UserRole;
import com.market.ecommerce.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    // This initializer should only run in development profile
    @Bean
    @Profile("dev")
    public CommandLineRunner initAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String adminEmail = "admin@example.com";
            if (!userRepository.existsByEmail(adminEmail)) {
                User admin = User.builder()
                        .name("Admin")
                        .email(adminEmail)
                        .password(passwordEncoder.encode("admin123"))
                        .role(UserRole.ADMIN)
                        .build();

                userRepository.save(admin);
                System.out.println("Created admin user: " + adminEmail + " password: admin123 (dev only)");
            } else {
                System.out.println("Admin user already exists: " + adminEmail);
            }
        };
    }
}
