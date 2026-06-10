package com.market.ecommerce.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "الاسم مطلوب")
        String name,

        @Email(message = "صيغة البريد الإلكتروني غير صحيحة")
        @NotBlank(message = "البريد الإلكتروني مطلوب")
        String email,

        @NotBlank(message = "كلمة المرور مطلوبة")
        @Size(min = 6, message = "يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل")
        String password
) {}