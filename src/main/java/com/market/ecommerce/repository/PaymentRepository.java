package com.market.ecommerce.repository;

import com.market.ecommerce.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // جلب بيانات الدفع الخاصة بطلب معين (مهمة جداً في واجهات المتجر)
    Optional<Payment> findByOrderId(Long orderId);

    // البحث عن عملية الدفع باستخدام معرف الحوالة أو المعاملة (للتأكد من عدم التكرار أو تتبع حالة الدفع)
    Optional<Payment> findByTransactionId(String transactionId);
}