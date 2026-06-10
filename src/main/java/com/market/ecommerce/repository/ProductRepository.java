package com.market.ecommerce.repository;

import com.market.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);

    // تمت إزالة OrderByNameAsc لتجنب أي تعارض مع خصائص Pageable
    Page<Product> findByNameContainingIgnoreCase(String keyword, Pageable pageable);
}