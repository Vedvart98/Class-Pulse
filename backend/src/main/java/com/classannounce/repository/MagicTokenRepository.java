package com.classannounce.repository;

import com.classannounce.entity.MagicToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MagicTokenRepository extends JpaRepository<MagicToken, Long> {
    Optional<MagicToken> findByTokenAndUsedAtIsNull(String token);
}