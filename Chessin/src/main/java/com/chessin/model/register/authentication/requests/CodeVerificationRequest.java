package com.chessin.model.register.authentication.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CodeVerificationRequest {

    private String email;
    private String verificationCode;
    private String oldPassword;
    private String newPassword;
    private VerificationType verificationType;
}
