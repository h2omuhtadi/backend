package com.market.ecommerce.dto;

import com.market.ecommerce.entity.PaymentMethod;
import com.market.ecommerce.entity.PaymentStatus;
import java.math.BigDecimal;

public record PaymentResponse(
        Long id,
        Long orderId,
        BigDecimal amount,
        PaymentMethod method,
        PaymentStatus status,
        String transactionId
) {}