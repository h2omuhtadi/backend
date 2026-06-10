package com.market.ecommerce.controller;

import com.market.ecommerce.dto.AuthResponse;
import com.market.ecommerce.dto.LoginRequest;
import com.market.ecommerce.dto.RegisterRequest;
import com.market.ecommerce.entity.User;
import com.market.ecommerce.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        User user = authService.register(request);

        // لا يوجد Token عند التسجيل المبدئي (اختياري حسب منطق عملك)
        AuthResponse response = new AuthResponse(null, user.getName(), user.getRole().name());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}