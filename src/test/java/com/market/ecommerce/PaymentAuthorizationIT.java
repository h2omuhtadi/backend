package com.market.ecommerce;

import com.market.ecommerce.dto.CheckoutRequest;
import com.market.ecommerce.dto.LoginRequest;
import com.market.ecommerce.dto.PaymentRequest;
import com.market.ecommerce.entity.*;
import com.market.ecommerce.repository.*;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class PaymentAuthorizationIT {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private Long productId;

    @BeforeEach
    void setup() {
        paymentRepository.deleteAll();
        orderRepository.deleteAll();
        cartItemRepository.deleteAll();
        productRepository.deleteAll();
        userRepository.deleteAll();
        addressRepository.deleteAll();

        Product p = Product.builder()
                .name("PayTest Product")
                .price(new BigDecimal("20.00"))
                .stock(10)
                .build();
        p = productRepository.save(p);
        productId = p.getId();

        // create users: owner, other, admin
        User owner = User.builder().name("Owner").email("owner@example.com").password(passwordEncoder.encode("ownerpass")).build();
        User other = User.builder().name("Other").email("other@example.com").password(passwordEncoder.encode("otherpass")).build();
        User admin = User.builder().name("Admin").email("admin@example.com").password(passwordEncoder.encode("adminpass")).role(UserRole.ADMIN).build();
        owner = userRepository.save(owner);
        other = userRepository.save(other);
        admin = userRepository.save(admin);

        Address addrOwner = Address.builder().user(owner).line1("Owner Addr").city("City").postalCode("1000").build();
        Address addrOther = Address.builder().user(other).line1("Other Addr").city("City").postalCode("1001").build();
        addrOwner = addressRepository.save(addrOwner);
        addrOther = addressRepository.save(addrOther);

        // owner cart
        CartItem ci = CartItem.builder().user(owner).product(p).quantity(1).build();
        cartItemRepository.save(ci);
    }

    private String extractValue(String body, String key) {
        if (body == null) return null;
        String quoteKey = "\"" + key + "\"";
        int idx = body.indexOf(quoteKey);
        if (idx == -1) return null;
        int colon = body.indexOf(':', idx);
        int start = body.indexOf('"', colon);
        if (start == -1) return null;
        int end = body.indexOf('"', start + 1);
        if (end == -1) return null;
        return body.substring(start + 1, end);
    }

    private String loginAndGetToken(String email, String password) {
        LoginRequest lr = new LoginRequest(email, password);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<LoginRequest> req = new HttpEntity<>(lr, headers);
        ResponseEntity<String> resp = restTemplate.postForEntity("http://localhost:" + port + "/api/auth/login", req, String.class);
        Assertions.assertTrue(resp.getStatusCode().is2xxSuccessful(), "login failed for " + email + ", body=" + resp.getBody());
        return extractValue(resp.getBody(), "token");
    }

    @Test
    void paymentAuthorizationOwnerVsOtherVsAdmin() {
        // owner login and checkout to create order
        String tokenOwner = loginAndGetToken("owner@example.com", "ownerpass");

        CheckoutRequest cr = new CheckoutRequest(1L); // address id 1 in this test setup
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(tokenOwner);
        HttpEntity<CheckoutRequest> cre = new HttpEntity<>(cr, headers);

        ResponseEntity<String> resp = restTemplate.postForEntity("http://localhost:" + port + "/api/orders/checkout", cre, String.class);
        Assertions.assertTrue(resp.getStatusCode().is2xxSuccessful(), "checkout failed: " + resp.getBody());
        String orderIdStr = extractValue(resp.getBody(), "id");
        Assertions.assertNotNull(orderIdStr);
        Long orderId = Long.valueOf(orderIdStr);

        // other user attempts to pay -> should be 403
        String tokenOther = loginAndGetToken("other@example.com", "otherpass");
        PaymentRequest prOther = new PaymentRequest(orderId, "20.00", "CARD");
        HttpHeaders headersOther = new HttpHeaders();
        headersOther.setContentType(MediaType.APPLICATION_JSON);
        headersOther.setBearerAuth(tokenOther);
        HttpEntity<PaymentRequest> pre = new HttpEntity<>(prOther, headersOther);
        ResponseEntity<String> payRespOther = restTemplate.postForEntity("http://localhost:" + port + "/api/payments", pre, String.class);
        Assertions.assertEquals(HttpStatus.FORBIDDEN, payRespOther.getStatusCode());

        // admin attempts to pay -> should be 201
        String tokenAdmin = loginAndGetToken("admin@example.com", "adminpass");
        PaymentRequest prAdmin = new PaymentRequest(orderId, "20.00", "CARD");
        HttpHeaders headersAdmin = new HttpHeaders();
        headersAdmin.setContentType(MediaType.APPLICATION_JSON);
        headersAdmin.setBearerAuth(tokenAdmin);
        HttpEntity<PaymentRequest> pae = new HttpEntity<>(prAdmin, headersAdmin);
        ResponseEntity<String> payRespAdmin = restTemplate.postForEntity("http://localhost:" + port + "/api/payments", pae, String.class);
        Assertions.assertEquals(HttpStatus.CREATED, payRespAdmin.getStatusCode());
    }
}
