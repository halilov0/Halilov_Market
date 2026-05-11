package com.halilov.market.order;

import com.halilov.market.catalog.Product;
import com.halilov.market.catalog.ProductRepository;
import com.halilov.market.user.User;
import com.halilov.market.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class OrderService {

    private static final int VAT_RATE_PERCENT = 18; // VAT 18% inclusive

    private final OrderRepository orders;
    private final AddressRepository addresses;
    private final ProductRepository products;
    private final UserRepository users;

    public OrderService(OrderRepository orders, AddressRepository addresses,
                        ProductRepository products, UserRepository users) {
        this.orders = orders;
        this.addresses = addresses;
        this.products = products;
        this.users = users;
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

        int gross = subtotal + req.shippingAgorot();
        int vat = Math.round(gross * (float) VAT_RATE_PERCENT / (100 + VAT_RATE_PERCENT));
        order.setSubtotalAgorot(subtotal);
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
        return OrderDtos.OrderView.from(order, addr);
    }

    private String generateOrderNumber() {
        long ts = System.currentTimeMillis();
        int rand = ThreadLocalRandom.current().nextInt(1000, 9999);
        return "HM-" + ts + "-" + rand;
    }
}
