package com.market.ecommerce.dto;

import com.market.ecommerce.entity.OrderStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record OrderResponse(
        Long id,
        BigDecimal totalAmount,
        OrderStatus status,
        LocalDateTime createdAt
) {}