package com.chessin.controller.register;

import com.chessin.model.register.user.Provider;
import com.chessin.model.register.user.User;
import com.chessin.model.register.user.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private UserRepository userRepository;

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
}
