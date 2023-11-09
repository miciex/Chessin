package com.chessin.model.register.authentication.verificationCode;

import com.chessin.model.register.user.User;
import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

@Data
@Entity
public class VerificationCode {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    @OneToOne
    private User user;
    @Column(nullable = false, unique = true)
    private String code;
    @Column(nullable = false)
    private Instant expiryDate;

    public VerificationCode() {
        this.code = generateCode(8);
        this.expiryDate = Instant.now().plusSeconds(60 * 2);
    }

    public static String generateCode(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            int index = (int)(Math.random() * chars.length());
            sb.append(chars.charAt(index));
        }
        return sb.toString();
    }
}
