package com.chessin.controller.register;

import com.chessin.controller.requests.*;
import com.chessin.model.register.authentication.refreshToken.RefreshTokenRepository;
import com.chessin.model.register.authentication.refreshToken.RefreshToken;
import com.chessin.model.register.authentication.verificationCode.VerificationCode;
import com.chessin.model.register.authentication.verificationCode.VerificationCodeRepository;
import com.chessin.controller.responses.AuthenticationResponse;
import com.chessin.model.register.configuration.JwtService;
import com.chessin.model.register.user.Provider;
import com.chessin.model.register.user.User;
import com.chessin.model.register.user.UserRepository;
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

    @Transactional
    public ResponseEntity<?> register(RegisterRequest request)
    {
        var user = User
                .builder()
                .firstname(request.getFirstname())
                .lastName(request.getLastname())
                .nameInGame(request.getNameInGame())
                .email(request.getEmail())
                .country(request.getCountry())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(USER)
                .isTwoFactorAuthenticationEnabled(true)
                .provider(Provider.LOCAL)
                .isActivated(false)
                .build();

        userRepository.save(user);

        sendVerificationCode(userRepository.findByEmail(request.getEmail()).get());
        return ResponseEntity.accepted().body("Verification code sent to your email address.");
    }

    public ResponseEntity<?> activateAccount(CodeVerificationRequest request){
        if(!verificationCodeRepository.existsByCode(request.getVerificationCode()))
            return ResponseEntity.badRequest().body("Code is incorrect.");

        var code = verificationCodeRepository.findByCode(request.getVerificationCode()).get();

        if(!code.getUser().getEmail().equals(request.getEmail()))
            return ResponseEntity.badRequest().body("Code is incorrect.");

        if(code.getExpiryDate().compareTo(Instant.now()) < 0)
            return ResponseEntity.badRequest().body("Code is expired.");

        var user = code.getUser();

        var jwtToken = jwtService.generateToken(user);

        verificationCodeRepository.delete(code);

        user.setActivated(true);

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

    public ResponseEntity<?> finishAuthentication(CodeVerificationRequest request){

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

    public ResponseEntity<?> finishChangingPassword(CodeVerificationRequest request)
    {
        if(request.getVerificationType() != VerificationType.REMIND_PASSWORD)
        {
            try
            {
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
            } catch(AuthenticationException e){
                return ResponseEntity.badRequest().body("Password incorrect.");
            }
        }

        if(!verificationCodeRepository.existsByCode(request.getVerificationCode()))
            return ResponseEntity.badRequest().body("Code is incorrect.");

        var code = verificationCodeRepository.findByCode(request.getVerificationCode()).get();

        if(!code.getUser().getEmail().equals(request.getEmail()))
            return ResponseEntity.badRequest().body("Code is incorrect.");

        if(code.getExpiryDate().compareTo(Instant.now()) < 0)
            return ResponseEntity.badRequest().body("Code is expired.");

        var user = code.getUser();

        if(passwordEncoder.matches(request.getNewPassword(), user.getPassword()))
            return ResponseEntity.badRequest().body("New password cannot be the same as the old one.");

        verificationCodeRepository.delete(code);

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        //userRepository.save(user);

        return ResponseEntity.ok("Password changed successfully.");
    }

    @Transactional
    public void sendVerificationCode(User user){
        VerificationCode code;

        if(verificationCodeRepository.existsByUserId(user.getId())) {
            if (verificationCodeRepository.findByUserId(user.getId()).get().getExpiryDate().compareTo(Instant.now()) < 0) {
                verificationCodeRepository.deleteByUserId(user.getId());
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

    @Transactional
    public ResponseEntity<?> changePassword(PasswordChangeRequest request)
    {
        var user = userRepository.findByEmail(request.getEmail()).orElseThrow();

        if(!user.isTwoFactorAuthenticationEnabled()) {
            try {
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getOldPassword()));
            } catch (AuthenticationException e) {
                return ResponseEntity.badRequest().body("Password incorrect.");
            }

            if (passwordEncoder.matches(request.getNewPassword(), user.getPassword()))
                return ResponseEntity.badRequest().body("New password cannot be the same as the old one.");

            if (user.isTwoFactorAuthenticationEnabled()) {
                sendVerificationCode(user);
                return ResponseEntity.accepted().body("Verification code sent to your email address.");
            }

            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);

            return ResponseEntity.ok("Password changed successfully.");
        }
        else
        {
            sendVerificationCode(user);

            return ResponseEntity.accepted().body("Verification code sent to your email address.");
        }
    }

    @Transactional
    public ResponseEntity<?> remindPassword(PasswordRemindRequest request)
    {
        var user = userRepository.findByEmail(request.getEmail()).orElseThrow();

        if(passwordEncoder.matches(request.getNewPassword(), user.getPassword()))
            return ResponseEntity.badRequest().body("New password cannot be the same as the old one.");

        sendVerificationCode(user);

        return ResponseEntity.accepted().body("Verification code sent to your email address.");
    }
}
