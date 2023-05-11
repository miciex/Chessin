package com.chessin.security.services;

import com.chessin.security.authentication.refreshToken.RefreshToken;
import com.chessin.security.authentication.refreshToken.RefreshTokenRepository;
import com.chessin.security.authentication.requests.CodeVerificationRequest;
import com.chessin.security.authentication.verificationCode.VerificationCode;
import com.chessin.security.authentication.verificationCode.VerificationCodeRepository;
import com.chessin.security.services.RefreshTokenService;
import com.chessin.security.authentication.requests.AuthenticationRequest;
import com.chessin.security.authentication.requests.RegisterRequest;
import com.chessin.security.authentication.responses.AuthenticationResponse;
import com.chessin.security.configuration.JwtService;
import com.chessin.security.user.User;
import com.chessin.security.user.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

import static org.hibernate.cfg.AvailableSettings.USER;


@Data
@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final VerificationCodeRepository verificationCodeRepository;
    private final EmailService emailService;

    public ResponseEntity<?> register(RegisterRequest request){

        var user = User
                .builder()
                .firstname(request.getFirstname())
                .lastName(request.getLastname())
                .nameInGame(request.getNameInGame())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(USER)
                .isTwoFactorAuthenticationEnabled(true)
                .build();

        var jwtToken = jwtService.generateToken(user);

        userRepository.save(user);

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        return ResponseEntity.ok(AuthenticationResponse
                .builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken.getToken())
                .build());

    }

    @Transactional
    public ResponseEntity<?> authenticate(AuthenticationRequest request){

        try
        {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        } catch(AuthenticationException e){
            return ResponseEntity.badRequest().body("Password incorrect.");
        }


        var user = userRepository.findByEmail(request.getEmail()).orElseThrow();

        if(user.isTwoFactorAuthenticationEnabled()) {
            sendVerificationCode(user);
            return ResponseEntity.accepted().body("Verification code sent to your email address.");
        }

        var jwtToken = jwtService.generateToken(user);
        RefreshToken refreshToken;

        if(refreshTokenRepository.existsByUserId(user.getId()) && refreshTokenService.isTokenExpired(refreshTokenRepository.findByUserId(user.getId()).get()))
            refreshToken = refreshTokenService.createRefreshToken(user.getId());
        else if(!refreshTokenRepository.existsByUserId(user.getId()))
            refreshToken = refreshTokenService.createRefreshToken(user.getId());
        else
            refreshToken = refreshTokenRepository.findByUserId(user.getId()).get();

        return ResponseEntity.ok(AuthenticationResponse
                .builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken.getToken())
                .build());
    }

    public ResponseEntity<?> verifyCode(CodeVerificationRequest request){

        if(!verificationCodeRepository.existsByCode(request.getVerificationCode()))
            return ResponseEntity.badRequest().body("Code is incorrect.");

        var code = verificationCodeRepository.findByCode(request.getVerificationCode()).get();

        if(!code.getUser().getEmail().equals(request.getEmail()))
            return ResponseEntity.badRequest().body("Code is incorrect.");

        if(code.getExpiryDate().compareTo(Instant.now()) < 0)
            return ResponseEntity.badRequest().body("Code is expired.");

        var user = code.getUser();

        verificationCodeRepository.delete(code);

        var jwtToken = jwtService.generateToken(user);
        RefreshToken refreshToken;

        if(refreshTokenRepository.existsByUserId(user.getId()) && refreshTokenService.isTokenExpired(refreshTokenRepository.findByUserId(user.getId()).get()))
            refreshToken = refreshTokenService.createRefreshToken(user.getId());
        else if(!refreshTokenRepository.existsByUserId(user.getId()))
            refreshToken = refreshTokenService.createRefreshToken(user.getId());
        else
            refreshToken = refreshTokenRepository.findByUserId(user.getId()).get();

        return ResponseEntity.ok(AuthenticationResponse
                .builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken.getToken())
                .build());
    }

    @Transactional
    public void sendVerificationCode(User user){
        VerificationCode code;

        if(verificationCodeRepository.existsByUserId(user.getId())) {
            if (verificationCodeRepository.findByUserId(user.getId()).get().getExpiryDate().compareTo(Instant.now()) < 0) {
                verificationCodeRepository.deleteByUser(user);
                code = new VerificationCode();
                code.setUser(user);
                verificationCodeRepository.save(code);
            } else {
                code = verificationCodeRepository.findByUserId(user.getId()).get();
            }
        }
        else
            {
                code = new VerificationCode();
                code.setUser(user);
                verificationCodeRepository.save(code);
            }

        emailService.sendEmail(user.getEmail(), code.getCode());
    }
}
