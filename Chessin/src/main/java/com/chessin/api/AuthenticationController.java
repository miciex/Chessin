package com.chessin.api;

import com.chessin.security.authentication.refreshToken.RefreshToken;
import com.chessin.security.authentication.requests.CodeVerificationRequest;
import com.chessin.security.services.RefreshTokenService;
import com.chessin.security.authentication.refreshToken.TokenRefreshException;
import com.chessin.security.authentication.requests.AuthenticationRequest;
import com.chessin.security.authentication.requests.TokenRefreshRequest;
import com.chessin.security.services.AuthenticationService;
import com.chessin.security.authentication.requests.RegisterRequest;
import com.chessin.security.authentication.responses.TokenRefreshResponse;
import com.chessin.security.configuration.JwtService;
import com.chessin.security.user.User;
import com.chessin.security.user.UserRepository;
import com.chessin.security.user.UserResponse;
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

    @GetMapping("/email")
    public ResponseEntity<?> email(){
        return ResponseEntity.ok("Email sent");

    }

    @PostMapping("/verifyCode")
    public ResponseEntity<?> verifyCode(@RequestBody CodeVerificationRequest request){

        if(!repository.existsByEmail(request.getEmail())){
            return ResponseEntity.badRequest().body("Email does not exist in the database.");
        }

        return service.verifyCode(request);
    }

//    @PostMapping(path = "/users/get/{userEmail}")
//    public ResponseEntity<UserResponse> getUser(@PathVariable String userEmail){
//        User user = repository.findByEmail(userEmail).orElseThrow();
//        UserResponse userResponse = UserResponse.fromUser(user);
//        return ResponseEntity.ok(userResponse);
//    }

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
