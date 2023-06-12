package com.chessin.controller.register;

import com.chessin.model.register.user.Provider;
import com.chessin.model.register.user.User;
import com.chessin.model.register.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public void processOAuthPostLogin(String email) {
        User user = userRepository.findByEmail(email).get();

        if (user == null) {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setProvider(Provider.GOOGLE);
            userRepository.save(newUser);
        }
    }

    public User setActive(String nickname, boolean active) {
        User user = userRepository.findByNameInGame(nickname).orElse(null);
        if(user != null){
            user.setOnline(active);
            userRepository.save(user);
        }
        return user;
    }
}
