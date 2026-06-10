package com.market.ecommerce.service;

import com.market.ecommerce.dto.CheckoutRequest;
import com.market.ecommerce.dto.OrderItemResponse;
import com.market.ecommerce.dto.OrderResponse;
import com.market.ecommerce.entity.*;
import com.market.ecommerce.exception.BadRequestException;
import com.market.ecommerce.exception.ResourceNotFoundException;
import com.market.ecommerce.repository.*;
import com.market.ecommerce.security.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;

    public OrderService(OrderRepository orderRepository,
                        CartItemRepository cartRepository,
                        ProductRepository productRepository,
                        UserRepository userRepository,
                        AddressRepository addressRepository) {

        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
    }

    @Transactional
    public Order checkout(CheckoutRequest request) {
        String email = SecurityUtils.getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("المستخدم غير موجود"));

        Address shippingAddress = addressRepository.findById(request.shippingAddressId())
                .orElseThrow(() -> new ResourceNotFoundException("عنوان الشحن غير موجود"));

        if (!shippingAddress.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("عنوان الشحن لا يخص المستخدم الحالي");
        }

        List<CartItem> cartItems = cartRepository.findByUser(user);
        if (cartItems.isEmpty()) {
            throw new BadRequestException("سلة المشتريات فارغة");
        }

        Order order = Order.builder()
                .user(user)
                .shippingAddress(shippingAddress)
                .status(OrderStatus.NEW)
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();
        List<Product> productsToUpdate = new ArrayList<>(); // لتحديث المخزون دفعة واحدة

        for (CartItem item : cartItems) {
            Product product = item.getProduct();

            if (product.getStock() < item.getQuantity()) {
                throw new BadRequestException("المخزون غير كافٍ للمنتج: " + product.getName());
            }

            product.setStock(product.getStock() - item.getQuantity());
            productsToUpdate.add(product);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(item.getQuantity())
                    .price(product.getPrice())
                    .build();

            orderItems.add(orderItem);
            totalAmount = totalAmount.add(product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }

        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);

        // حفظ التغييرات
        productRepository.saveAll(productsToUpdate);
        Order savedOrder = orderRepository.save(order);
        cartRepository.deleteByUserId(user.getId());

        return savedOrder;
    }

    @Transactional
    public Order complete(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("الطلب غير موجود"));

        if (order.getStatus() == OrderStatus.COMPLETED) {
            throw new BadRequestException("الطلب مكتمل بالفعل");
        }

        order.setStatus(OrderStatus.COMPLETED);
        return orderRepository.save(order);
    }

    @Transactional
    public void cancel(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("الطلب غير موجود"));

        if (order.getStatus() == OrderStatus.COMPLETED) {
            throw new BadRequestException("لا يمكن إلغاء طلب مكتمل وشُحن بالفعل");
        }
        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new BadRequestException("الطلب ملغي بالفعل");
        }

        order.setStatus(OrderStatus.CANCELLED);
        List<Product> productsToUpdate = new ArrayList<>();

        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            productsToUpdate.add(product);
        }

        productRepository.saveAll(productsToUpdate); // تحديث المخزون دفعة واحدة
        orderRepository.save(order);
    }

    // New: return the Order entity by id
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("الطلب غير موجود"));
    }

    // New: return the Order entity with user fetched
    public Order getOrderByIdWithUser(Long id) {
        return orderRepository.findByIdWithUser(id)
                .orElseThrow(() -> new ResourceNotFoundException("الطلب غير موجود"));
    }

    // New: return safe DTO for order detail
    public OrderResponse getOrderByIdDto(Long id) {
        Order order = getOrderById(id);

        var items = order.getItems().stream()
                .map(it -> new OrderItemResponse(
                        it.getId(),
                        it.getProduct().getId(),
                        it.getProduct().getName(),
                        it.getQuantity(),
                        it.getPrice().toString()
                ))
                .collect(Collectors.toList());

        return new OrderResponse(
                order.getId(),
                order.getTotalAmount() != null ? order.getTotalAmount().toString() : "0.00",
                order.getStatus() != null ? order.getStatus().name() : "",
                order.getShippingAddress() != null ? order.getShippingAddress().getId() : null,
                items
        );
    }

    // إضافة دالة جلب طلبات المستخدم الحالي
    public List<Order> getUserOrders() {
        String email = SecurityUtils.getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("المستخدم غير موجود"));

        // تم التعديل هنا: جلب الطلبات مباشرة من قاعدة البيانات بدلاً من تصفيتها في الذاكرة
        return orderRepository.findByUserId(user.getId());
    }

    // إضافة دالة جلب كافة الطلبات (للإدارة)
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}
