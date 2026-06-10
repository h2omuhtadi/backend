package com.market.ecommerce.service;

import com.market.ecommerce.dto.ProductRequest;
import com.market.ecommerce.entity.Category;
import com.market.ecommerce.entity.Product;
import com.market.ecommerce.exception.ResourceNotFoundException;
import com.market.ecommerce.repository.CategoryRepository;
import com.market.ecommerce.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(
            ProductRepository productRepository,
            CategoryRepository categoryRepository
    ) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public Product createProduct(ProductRequest request) {

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "القسم غير موجود برقم معرف: "
                                        + request.categoryId()
                        )
                );

        Product product = Product.builder()
                .name(request.name().trim())
                .description(request.description())
                .price(request.price())
                .stock(request.stock())
                .imageUrl(request.imageUrl())
                .category(category)
                .build();

        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {

        return productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "المنتج غير موجود برقم معرف: " + id
                        )
                );
    }

    public void deleteProduct(Long id) {

        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "لا يمكن الحذف، المنتج غير موجود برقم معرف: " + id
            );
        }

        productRepository.deleteById(id);
    }
}