package com.market.ecommerce.controller;

import com.market.ecommerce.dto.OrderResponse;
import com.market.ecommerce.dto.CheckoutRequest;
import com.market.ecommerce.entity.Order;
import com.market.ecommerce.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<Order> checkout(@Valid @RequestBody CheckoutRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.checkout(request));
    }

    @GetMapping
    public ResponseEntity<List<Order>> getUserOrders() {
        return ResponseEntity.ok(orderService.getUserOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderByIdDto(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/complete")
    public ResponseEntity<Order> completeOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.complete(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelOrder(@PathVariable Long id) {
        orderService.cancel(id);
        return ResponseEntity.noContent().build();
    }
}
