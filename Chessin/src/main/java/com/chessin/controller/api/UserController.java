package com.chessin.controller.api;

import com.chessin.controller.register.UserService;
import com.chessin.controller.requests.FriendInvitationRequest;
import com.chessin.controller.responses.FriendInvitationResponse;
import com.chessin.model.register.user.User;
import com.chessin.controller.responses.UserResponse;
import com.chessin.model.register.user.UserRepository;
import com.chessin.model.social.FriendInvitation;
import com.chessin.model.social.FriendInvitationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/user")
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;
    FriendInvitationRepository friendInvitationRepository;

    @PostMapping("/findByEmail/{email}")
    public ResponseEntity<?> findByEmail(@PathVariable String email) {
        Optional<User> user = userService.findByEmail(email);
        UserResponse userResponse = UserResponse.fromUser(user.orElseThrow());
        return ResponseEntity.ok().body(userResponse);
    }

    @PostMapping("/addFriend")
    public ResponseEntity<?> addFriend(@RequestBody FriendInvitationRequest request) {
        if (!userRepository.existsByEmail(request.getEmail()))
            return ResponseEntity.badRequest().body("User does not exist");
        else if (!userRepository.existsByEmail(request.getFriendEmail()))
            return ResponseEntity.badRequest().body("Friend does not exist");

        friendInvitationRepository.save(FriendInvitation.builder()
                .user(userRepository.findByEmail(request.getEmail()).get())
                .friend(userRepository.findByEmail(request.getFriendEmail()).get())
                .date(Instant.now())
                .build());

        return ResponseEntity.ok().body("Invitation sent");
    }

    @PostMapping("/checkInvitations/{email}")
    public ResponseEntity<?> checkInvitations(@PathVariable String email) {
        if (!friendInvitationRepository.existsByUserEmail(email))
            return ResponseEntity.badRequest().body("No invitations");

        List<FriendInvitation> invitations = friendInvitationRepository.findAllByUserEmail(email);

        List<FriendInvitationResponse> responses = new ArrayList<>();

        for (FriendInvitation invitation : invitations)
            responses.add(FriendInvitationResponse.fromFriendInvitation(invitation));

        return ResponseEntity.ok().body(responses);
    }
}
