package com.halilov.market.order;

import com.halilov.market.catalog.Product;
import com.halilov.market.catalog.ProductRepository;
import com.halilov.market.common.Csv;
import com.halilov.market.coupon.CouponService;
import com.halilov.market.notification.EmailMessage;
import com.halilov.market.notification.EmailService;
import com.halilov.market.notification.OrderEmailBuilder;
import com.halilov.market.user.User;
import com.halilov.market.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);
    private static final int VAT_RATE_PERCENT = 18; // VAT 18% inclusive

    private final OrderRepository orders;
    private final AddressRepository addresses;
    private final ProductRepository products;
    private final UserRepository users;
    private final CouponService couponService;
    private final EmailService emailService;
    private final String adminBcc;
    private final String siteBaseUrl;

    public OrderService(OrderRepository orders, AddressRepository addresses,
                        ProductRepository products, UserRepository users,
                        CouponService couponService,
                        EmailService emailService,
                        @Value("${app.email.adminBcc:}") String adminBcc,
                        @Value("${app.email.siteBaseUrl:}") String siteBaseUrl) {
        this.orders = orders;
        this.addresses = addresses;
        this.products = products;
        this.users = users;
        this.couponService = couponService;
        this.emailService = emailService;
        this.adminBcc = adminBcc;
        this.siteBaseUrl = siteBaseUrl;
    }

    @Transactional
    public OrderDtos.OrderView createOrder(String email, OrderDtos.CreateOrderRequest req) {
        User user = users.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "no user"));

        // Load all products for the items in one go
        List<Long> productIds = req.items().stream().map(OrderDtos.OrderItemRequest::productId).distinct().toList();
        Map<Long, Product> byId = new HashMap<>();
        for (Product p : products.findAllById(productIds)) byId.put(p.getId(), p);

        Address addr = new Address();
        addr.setUserId(user.getId());
        addr.setFullName(req.shipping().fullName());
        addr.setPhone(req.shipping().phone());
        addr.setStreet(req.shipping().street());
        addr.setHouseNo(req.shipping().houseNo());
        addr.setApartment(req.shipping().apartment());
        addr.setCity(req.shipping().city());
        addr.setPostalCode(req.shipping().postalCode());
        addr.setNotes(req.shipping().notes());
        addr = addresses.save(addr);

        Order order = new Order();
        order.setUserId(user.getId());
        order.setStatus(OrderStatus.PENDING);
        order.setShippingAddressId(addr.getId());
        order.setShippingAgorot(req.shippingAgorot());

        int subtotal = 0;
        for (OrderDtos.OrderItemRequest itemReq : req.items()) {
            Product p = byId.get(itemReq.productId());
            if (p == null || !p.isActive()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "product unavailable: " + itemReq.productId());
            }
            if (itemReq.quantity() > p.getStockQty()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "not enough stock for " + p.getNameHe());
            }
            int lineTotal = p.getPriceAgorot() * itemReq.quantity();
            OrderItem oi = new OrderItem();
            oi.setProductId(p.getId());
            oi.setNameHe(p.getNameHe());
            oi.setSku(p.getSku());
            oi.setUnitPriceAgorot(p.getPriceAgorot());
            oi.setQuantity(itemReq.quantity());
            oi.setLineTotalAgorot(lineTotal);
            order.addItem(oi);
            subtotal += lineTotal;
        }

        var applied = couponService.resolveForOrder(req.couponCode(), subtotal).orElse(null);
        int discount = applied != null ? applied.discountAgorot() : 0;
        int gross = subtotal - discount + req.shippingAgorot();
        int vat = Math.round(gross * (float) VAT_RATE_PERCENT / (100 + VAT_RATE_PERCENT));
        order.setSubtotalAgorot(subtotal);
        order.setDiscountAgorot(discount);
        if (applied != null) order.setCouponCode(applied.code());
        order.setVatAgorot(vat);
        order.setTotalAgorot(gross);
        order.setOrderNumber(generateOrderNumber());

        order = orders.save(order);
        return OrderDtos.OrderView.from(order, addr);
    }

    @Transactional(readOnly = true)
    public OrderDtos.OrderView getMine(String email, String orderNumber) {
        User user = users.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "no user"));
        Order order = orders.findByOrderNumber(orderNumber)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "order not found"));
        if (!user.getId().equals(order.getUserId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "order not found");
        }
        Address addr = order.getShippingAddressId() != null
            ? addresses.findById(order.getShippingAddressId()).orElse(null)
            : null;
        return OrderDtos.OrderView.from(order, addr);
    }

    @Transactional(readOnly = true)
    public List<OrderDtos.OrderView> listMine(String email) {
        User user = users.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "no user"));
        return orders.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
            .map(o -> OrderDtos.OrderView.from(o,
                o.getShippingAddressId() != null
                    ? addresses.findById(o.getShippingAddressId()).orElse(null)
                    : null))
            .toList();
    }

    @Transactional(readOnly = true)
    public List<OrderDtos.OrderView> adminListAll() {
        return orders.findAllByOrderByCreatedAtDesc().stream()
            .map(o -> OrderDtos.OrderView.from(o,
                o.getShippingAddressId() != null
                    ? addresses.findById(o.getShippingAddressId()).orElse(null)
                    : null))
            .toList();
    }

    @Transactional(readOnly = true)
    public String exportOrdersCsv() {
        StringBuilder out = new StringBuilder(Csv.BOM);
        out.append(Csv.row(
            "orderNumber", "createdAt", "status",
            "subtotalAgorot", "discountAgorot", "shippingAgorot", "vatAgorot", "totalAgorot",
            "couponCode", "itemCount",
            "customerName", "phone", "street", "houseNo", "city", "postalCode"
        ));
        for (Order o : orders.findAllByOrderByCreatedAtDesc()) {
            Address a = o.getShippingAddressId() != null
                ? addresses.findById(o.getShippingAddressId()).orElse(null)
                : null;
            int itemCount = o.getItems().stream().mapToInt(OrderItem::getQuantity).sum();
            out.append(Csv.row(
                o.getOrderNumber(),
                o.getCreatedAt().toString(),
                o.getStatus().name(),
                o.getSubtotalAgorot(),
                o.getDiscountAgorot(),
                o.getShippingAgorot(),
                o.getVatAgorot(),
                o.getTotalAgorot(),
                o.getCouponCode() == null ? "" : o.getCouponCode(),
                itemCount,
                a == null ? "" : nz(a.getFullName()),
                a == null ? "" : nz(a.getPhone()),
                a == null ? "" : nz(a.getStreet()),
                a == null ? "" : nz(a.getHouseNo()),
                a == null ? "" : nz(a.getCity()),
                a == null ? "" : nz(a.getPostalCode())
            ));
        }
        return out.toString();
    }

    private static String nz(String s) { return s == null ? "" : s; }

    @Transactional(readOnly = true)
    public OrderDtos.OrderView adminGet(String orderNumber) {
        Order order = orders.findByOrderNumber(orderNumber)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "order not found"));
        Address addr = order.getShippingAddressId() != null
            ? addresses.findById(order.getShippingAddressId()).orElse(null)
            : null;
        return OrderDtos.OrderView.from(order, addr);
    }

    @Transactional
    public OrderDtos.OrderView adminUpdateStatus(String orderNumber, OrderStatus newStatus) {
        Order order = orders.findByOrderNumber(orderNumber)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "order not found"));

        OrderStatus old = order.getStatus();
        if (old == newStatus) {
            return OrderDtos.OrderView.from(order,
                order.getShippingAddressId() != null
                    ? addresses.findById(order.getShippingAddressId()).orElse(null) : null);
        }

        // Decrement stock once on PENDING -> PAID
        if (old == OrderStatus.PENDING && newStatus == OrderStatus.PAID) {
            for (OrderItem oi : order.getItems()) {
                Product p = products.findById(oi.getProductId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.CONFLICT,
                        "product missing: " + oi.getProductId()));
                if (p.getStockQty() < oi.getQuantity()) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "not enough stock to fulfill: " + p.getNameHe());
                }
                p.setStockQty(p.getStockQty() - oi.getQuantity());
            }
            order.setPaidAt(java.time.Instant.now());
        }

        order.setStatus(newStatus);
        Address addr = order.getShippingAddressId() != null
            ? addresses.findById(order.getShippingAddressId()).orElse(null) : null;

        if (old == OrderStatus.PENDING && newStatus == OrderStatus.PAID) {
            if (order.getCouponCode() != null) {
                try {
                    couponService.incrementUsage(order.getCouponCode());
                } catch (Exception e) {
                    log.warn("failed to bump coupon usage for {}: {}", order.getOrderNumber(), e.toString());
                }
            }
            sendOrderPaidEmail(order, addr);
        }

        return OrderDtos.OrderView.from(order, addr);
    }

    private void sendOrderPaidEmail(Order order, Address addr) {
        try {
            User buyer = users.findById(order.getUserId()).orElse(null);
            if (buyer == null) {
                log.warn("order {} has no buyer user, skipping email", order.getOrderNumber());
                return;
            }
            String customerName = addr != null && addr.getFullName() != null && !addr.getFullName().isBlank()
                ? addr.getFullName() : buyer.getFullName();
            List<String> bcc = new ArrayList<>();
            if (adminBcc != null && !adminBcc.isBlank()) bcc.add(adminBcc.trim());
            emailService.send(new EmailMessage(
                buyer.getEmail(),
                customerName,
                OrderEmailBuilder.subject(order),
                OrderEmailBuilder.html(order, addr, customerName, siteBaseUrl),
                bcc
            ));
        } catch (Exception e) {
            log.warn("failed to send order paid email for {}: {}", order.getOrderNumber(), e.toString());
        }
    }

    private String generateOrderNumber() {
        long ts = System.currentTimeMillis();
        int rand = ThreadLocalRandom.current().nextInt(1000, 9999);
        return "HM-" + ts + "-" + rand;
    }
}
