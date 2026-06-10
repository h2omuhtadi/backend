package com.market.ecommerce.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @Email(message = "صيغة البريد الإلكتروني غير صحيحة")
        @NotBlank(message = "البريد الإلكتروني مطلوب")
        String email,

        @NotBlank(message = "كلمة المرور مطلوبة")
        String password
) {}