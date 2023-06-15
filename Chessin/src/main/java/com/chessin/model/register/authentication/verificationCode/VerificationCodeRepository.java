package com.chessin.model.register.authentication.verificationCode;

import com.chessin.model.register.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.Optional;

public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {
    Optional<VerificationCode> findByUserId(Long userId);
    Optional<VerificationCode> findByCode(String code);
    void deleteByUserId(Long userId);
    boolean existsByCode(String code);

    boolean existsByUserId(Long userId);


    @Modifying
    int deleteByUser(User user);

    @Modifying
    int deleteByUserId(Long userId);
}
