package com.chessin.security.authentication;

import com.chessin.security.authentication.refreshToken.RefreshToken;
import com.chessin.security.authentication.refreshToken.RefreshTokenService;
import com.chessin.security.authentication.requests.AuthenticationRequest;
import com.chessin.security.authentication.requests.RegisterRequest;
import com.chessin.security.authentication.requests.TokenRefreshRequest;
import com.chessin.security.authentication.responses.AuthenticationResponse;
import com.chessin.security.authentication.responses.TokenRefreshResponse;
import com.chessin.security.configuration.JwtService;
import com.chessin.security.user.User;
import com.chessin.security.user.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import static org.hibernate.cfg.AvailableSettings.USER;


@Data
@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;

    public AuthenticationResponse register(RegisterRequest request){

        var user = User
                .builder()
                .firstname(request.getFirstname())
                .lastName(request.getLastname())
                .nameInGame(request.getNameInGame())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(USER)
                .build();

        var jwtToken = jwtService.generateToken(user);

        repository.save(user);

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        return AuthenticationResponse
                .builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken.getToken())
                .build();

    }

    public AuthenticationResponse authenticate(AuthenticationRequest request){

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        var user = repository.findByEmail(request.getEmail()).orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        return AuthenticationResponse
                .builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken.getToken())
                .build();

    }
}
