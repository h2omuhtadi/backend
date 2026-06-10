package com.market.ecommerce.controller;

import com.market.ecommerce.dto.PaymentRequest;
import com.market.ecommerce.dto.PaymentResponse;
import com.market.ecommerce.entity.Order;
import com.market.ecommerce.entity.Payment;
import com.market.ecommerce.entity.PaymentStatus;
import com.market.ecommerce.service.OrderService;
import com.market.ecommerce.service.PaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final OrderService orderService;

    public PaymentController(PaymentService paymentService, OrderService orderService) {
        this.paymentService = paymentService;
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<PaymentResponse> makePayment(@RequestBody PaymentRequest request) {
        // Basic validation: ensure order exists
        Order order = orderService.getOrderById(request.orderId());
        Payment payment = paymentService.processPayment(request, order);

        PaymentResponse res = new PaymentResponse(payment.getId(), order.getId(), payment.getStatus().name(), payment.getAmount().toString());
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }
}
