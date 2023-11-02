package com.chessin.controller.register;

import com.chessin.model.register.authentication.refreshToken.RefreshTokenRepository;
import com.chessin.model.register.authentication.refreshToken.RefreshToken;
import com.chessin.model.register.authentication.refreshToken.TokenRefreshException;
import com.chessin.model.register.user.UserRepository;
import com.chessin.model.utils.Constants;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    public Optional<RefreshToken> findByToken(String token)
    {
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken createRefreshToken(Long userId)
    {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(userRepository.findById(userId).get());
        refreshToken.setExpiryDate(Instant.now().plusMillis(Constants.Application.refreshTokenExpirationTime));
        refreshToken.setToken(UUID.randomUUID().toString());

        refreshToken = refreshTokenRepository.save(refreshToken);

        return refreshToken;
    }

    public RefreshToken verifyExpiration(RefreshToken token)
    {
        if(token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(), "Refresh token was expired. Please make a new signin request");
        }

        return token;
    }

    public boolean isTokenExpired(RefreshToken token)
    {
        if(token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            return true;
        }

        return false;
    }

    @Transactional
    public int deleteByUserId(Long userId)
    {
        return refreshTokenRepository.deleteByUser(userRepository.findById(userId).get());
    }
}
