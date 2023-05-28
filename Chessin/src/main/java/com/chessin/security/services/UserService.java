package com.chessin.security.services;

import com.chessin.security.user.Provider;
import com.chessin.security.user.User;
import com.chessin.security.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public void processOAuthPostLogin(String email) {
        User user = userRepository.findByEmail(email).get();

        if(user == null)
        {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setProvider(Provider.GOOGLE);
            userRepository.save(newUser);
        }
    }

    public Optional<User> findByEmail(String email){
        return userRepository.findByEmail(email);
    }
}
