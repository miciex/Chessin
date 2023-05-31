package com.chessin.controller.api;

import com.chessin.controller.register.UserService;
import com.chessin.model.register.user.Requests.SetOnlineRequest;
import com.chessin.model.register.user.User;
import com.chessin.model.register.user.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/user")
public class UserController {
    private final UserService service;

    @PostMapping("/findByEmail/{email}")
    public ResponseEntity<?> findByEmail(@PathVariable String email){
        Optional<User> user = service.findByEmail(email);

        UserResponse userResponse = UserResponse.fromUser(user.orElseThrow());
        System.out.println(userResponse.toString());
        return ResponseEntity.ok().body(userResponse);
    }

    @PostMapping("/setActive/{email}")
    public ResponseEntity<?> setActive(@PathVariable String email, @RequestBody SetOnlineRequest active){
        User user = service.setActive(email, active.isOnline()); 
        return user != null ? ResponseEntity.ok().body(user) : ResponseEntity.badRequest().body("User not found.");
    }
}
