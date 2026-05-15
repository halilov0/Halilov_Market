package com.halilov.market.notification;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface EmailOutboxRepository extends JpaRepository<EmailOutbox, Long> {

    @Query("SELECT e FROM EmailOutbox e " +
           "WHERE e.status = :status " +
           "  AND (e.lastAttemptAt IS NULL OR e.lastAttemptAt < :cutoff) " +
           "ORDER BY e.id ASC")
    List<EmailOutbox> findRetryable(
        @Param("status") EmailOutboxStatus status,
        @Param("cutoff") Instant cutoff,
        Pageable pageable
    );
}
