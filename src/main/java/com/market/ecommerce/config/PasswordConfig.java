package com.market.ecommerce.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class PasswordConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        // استخدام BCrypt وهو المعيار القياسي لتشفير كلمات المرور في التطبيقات الحديثة
        return new BCryptPasswordEncoder();
    }
}