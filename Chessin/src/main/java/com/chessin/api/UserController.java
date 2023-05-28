package com.chessin.api;

import com.chessin.security.services.UserService;
import com.chessin.security.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/user")
public class UserController {

    private final UserService service;

    @PostMapping("/findByEmail/{email}")
    public ResponseEntity<?> findByEmail(@PathVariable String email){
        Optional<User> user = service.findByEmail(email);

        return user.isPresent() ? ResponseEntity.ok().body(service.findByEmail(email)) : ResponseEntity.badRequest().body("User not found.");
    }

}
