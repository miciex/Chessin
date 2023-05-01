package com.chessin.security.authentication;

import com.chessin.security.authentication.refreshToken.RefreshToken;
import com.chessin.security.authentication.refreshToken.RefreshTokenRepository;
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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

        userRepository.save(user);

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

        var user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        RefreshToken refreshToken;

        if(refreshTokenRepository.existsByUserId(user.getId()) && refreshTokenService.isTokenExpired(refreshTokenRepository.findByUserId(user.getId()).get()))
            refreshToken = refreshTokenService.createRefreshToken(user.getId());
        else if(!refreshTokenRepository.existsByUserId(user.getId()))
            refreshToken = refreshTokenService.createRefreshToken(user.getId());
        else
            refreshToken = refreshTokenRepository.findByUserId(user.getId()).get();

        return AuthenticationResponse
                .builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken.getToken())
                .build();

    }
}
