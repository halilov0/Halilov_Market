package com.halilov.online.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SavedAddressRepository extends JpaRepository<SavedAddress, Long> {
    List<SavedAddress> findByUserIdOrderByIsDefaultDescCreatedAtDesc(Long userId);
    Optional<SavedAddress> findByIdAndUserId(Long id, Long userId);
    Optional<SavedAddress> findFirstByUserIdAndIsDefaultTrue(Long userId);
    long countByUserId(Long userId);
}
