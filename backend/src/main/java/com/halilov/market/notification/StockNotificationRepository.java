package com.halilov.market.notification;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StockNotificationRepository extends JpaRepository<StockNotification, Long> {
    Optional<StockNotification> findFirstByProductIdAndEmailAndNotifiedAtIsNull(Long productId, String email);
    List<StockNotification> findByProductIdAndNotifiedAtIsNull(Long productId);
}
