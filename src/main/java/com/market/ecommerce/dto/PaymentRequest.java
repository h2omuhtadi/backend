package com.market.ecommerce.dto;

import com.market.ecommerce.entity.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public record PaymentRequest(
        @NotNull(message = "رقم الطلب مطلوب")
        Long orderId,

        @NotNull(message = "طريقة الدفع مطلوبة")
        PaymentMethod method,

        @NotNull(message = "المبلغ مطلوب")
        @Positive(message = "المبلغ يجب أن يكون أكبر من صفر")
        BigDecimal amount
) {}