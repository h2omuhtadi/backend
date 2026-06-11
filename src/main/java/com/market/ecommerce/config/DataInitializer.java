package com.market.ecommerce.config;

import com.market.ecommerce.entity.User;
import com.market.ecommerce.entity.UserRole;
import com.market.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Value("${dev.admin.email:admin@example.com}")
    private String adminEmail;

    @Value("${dev.admin.password:admin123}")
    private String adminPassword;

    // This initializer should only run in development profile
    @Bean
    @Profile("dev")
    public CommandLineRunner initAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (!userRepository.existsByEmail(adminEmail)) {
                User admin = User.builder()
                        .name("Admin")
                        .email(adminEmail)
                        .password(passwordEncoder.encode(adminPassword))
                        .role(UserRole.ADMIN)
                        .build();

                userRepository.save(admin);
                System.out.println("Created admin user: " + adminEmail + " (dev only)");
            } else {
                System.out.println("Admin user already exists: " + adminEmail);
            }
        };
    }
}
