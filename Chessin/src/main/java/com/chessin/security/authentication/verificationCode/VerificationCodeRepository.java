package com.chessin.security.authentication.verificationCode;

import com.chessin.security.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.Optional;

public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {
    Optional<VerificationCode> findByUserId(Long userId);
    Optional<VerificationCode> findByCode(String code);

    boolean existsByUserId(Long userId);

    @Modifying
    int deleteByUser(User user);
}
