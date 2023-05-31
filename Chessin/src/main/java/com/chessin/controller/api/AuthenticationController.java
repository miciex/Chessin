package com.chessin.controller.api;

import com.chessin.model.register.authentication.refreshToken.RefreshToken;
import com.chessin.model.register.authentication.requests.*;
import com.chessin.controller.register.RefreshTokenService;
import com.chessin.model.register.authentication.refreshToken.TokenRefreshException;
import com.chessin.controller.register.AuthenticationService;
import com.chessin.model.register.authentication.responses.TokenRefreshResponse;
import com.chessin.model.register.configuration.JwtService;
import com.chessin.model.register.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/auth")
public class AuthenticationController {

    private final AuthenticationService service;
    private final UserRepository repository;
    private final RefreshTokenService refreshTokenService;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request){

        if(repository.existsByEmail(request.getEmail())){
            return ResponseEntity.badRequest().body("Email already exists in the database.");
        }

        return service.register(request);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(@RequestBody AuthenticationRequest request){

        if(!repository.existsByEmail(request.getEmail())){
            return ResponseEntity.badRequest().body("Email does not exist in the database.");
        }

        return service.authenticate(request);
    }

    @PostMapping("/verifyCode")
    public ResponseEntity<?> verifyCode(@RequestBody CodeVerificationRequest request){

        if(!repository.existsByEmail(request.getEmail())){
            return ResponseEntity.badRequest().body("Email does not exist in the database.");
        }

        return switch (request.getVerificationType()) {
            case AUTHENTICATE -> service.finishAuthentication(request);
            case CHANGE_PASSWORD, REMIND_PASSWORD -> service.finishChangingPassword(request);
            case REGISTER -> service.activateAccount(request);
            default -> ResponseEntity.badRequest().body("Invalid verification type.");
        };
    }

    @PostMapping("/changePassword")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeRequest request){

        if(!repository.existsByEmail(request.getEmail())){
            return ResponseEntity.badRequest().body("Email does not exist in the database.");
        }

        return service.changePassword(request);
    }

    @PostMapping("/remindPassword")
    public ResponseEntity<?> remindPassword(@RequestBody PasswordRemindRequest request){

        if(!repository.existsByEmail(request.getEmail())){
            return ResponseEntity.badRequest().body("Email does not exist in the database.");
        }

        return service.remindPassword(request);
    }

    @PostMapping("/2faEnabled")
    public ResponseEntity<?> twoFactorAuthenticationEnabled(@RequestBody TwoFactorAuthenticationEnabledRequest request){

        if(!repository.existsByEmail(request.getEmail())){
            return ResponseEntity.badRequest().body("Email does not exist in the database.");
        }

        return repository.findByEmail(request.getEmail()).get().isTwoFactorAuthenticationEnabled()
                ? ResponseEntity.ok().body("True") : ResponseEntity.ok().body("False");
    }

    @PostMapping("/refreshToken")
    public ResponseEntity<?> refreshToken(@RequestBody TokenRefreshRequest request)
    {
        return refreshTokenService.findByToken(request.getRefreshToken())
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String token = jwtService.generateToken(user);
                    return ResponseEntity.ok(new TokenRefreshResponse(token, request.getRefreshToken()));
                }).orElseThrow(() -> new TokenRefreshException(request.getRefreshToken(), "Refresh token is not in database."));
    }
}
