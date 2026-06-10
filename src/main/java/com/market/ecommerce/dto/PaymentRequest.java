package com.market.ecommerce.dto;

public record PaymentRequest(Long orderId, String amount, String method) { }
