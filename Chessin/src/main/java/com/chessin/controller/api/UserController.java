package com.chessin.controller.api;

import com.chessin.controller.register.UserService;
import com.chessin.controller.requests.FriendInvitationRequest;
import com.chessin.controller.requests.FriendInvitationResponseRequest;
import com.chessin.controller.responses.FriendInvitationResponse;
import com.chessin.model.register.user.Requests.SetOnlineRequest;
import com.chessin.model.register.user.User;
import com.chessin.controller.responses.UserResponse;
import com.chessin.model.register.user.UserRepository;
import com.chessin.model.social.FriendInvitation;
import com.chessin.model.social.FriendInvitationRepository;
import com.chessin.model.social.FriendInvitationResponseType;
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

    @PostMapping("/setActive/{email}")
    public ResponseEntity<?> setActive(@PathVariable String email, @RequestBody SetOnlineRequest active) {
        User user = userService.setActive(email, active.isOnline());
        return user != null ? ResponseEntity.ok().body(user) : ResponseEntity.badRequest().body("User not found.");
    }

    @PostMapping("/respondToInvitation")
    public ResponseEntity<?> respondToInvitation(@RequestBody FriendInvitationResponseRequest request) {
        if (!friendInvitationRepository.existsByUserEmailAndFriendEmail(request.getEmail(), request.getFriendEmail()))
            return ResponseEntity.badRequest().body("Invitation does not exist.");

        friendInvitationRepository.deleteByUserEmailAndFriendEmail(request.getEmail(), request.getFriendEmail());

        if (request.getResponseType() == FriendInvitationResponseType.ACCEPT) {
            User user = userRepository.findByEmail(request.getEmail()).get();
            User friend = userRepository.findByEmail(request.getFriendEmail()).get();

            user.getFriends().add(friend);
            friend.getFriends().add(user);

            userRepository.save(user);
            userRepository.save(friend);
        }

        return ResponseEntity.ok().body("Invitation responded");
    }

    @PostMapping("/getFriends/{email}")
    public ResponseEntity<?> getFriends(@PathVariable String email) {
        if (!userRepository.existsByEmail(email))
            return ResponseEntity.badRequest().body("User does not exist");

        User user = userRepository.findByEmail(email).get();

        List<UserResponse> friends = new ArrayList<>();

        for (User friend : user.getFriends())
            friends.add(UserResponse.fromUser(friend));

        return ResponseEntity.ok().body(friends);
    }

    @PostMapping("/removeFriend")
    public ResponseEntity<?> removeFriend(@RequestBody FriendInvitationRequest request) {
        if (!userRepository.existsByEmail(request.getEmail()))
            return ResponseEntity.badRequest().body("User does not exist.");
        else if (!userRepository.existsByEmail(request.getFriendEmail()))
            return ResponseEntity.badRequest().body("Friend does not exist.");

        User user = userRepository.findByEmail(request.getEmail()).get();
        User friend = userRepository.findByEmail(request.getFriendEmail()).get();

        user.getFriends().remove(friend);
        friend.getFriends().remove(user);

        userRepository.save(user);
        userRepository.save(friend);

        return ResponseEntity.ok().body("Friend removed.");
    }

    @PostMapping("/removeInvitation")
    public ResponseEntity<?> removeInvitation(@RequestBody FriendInvitationRequest request) {
        if (!friendInvitationRepository.existsByUserEmailAndFriendEmail(request.getEmail(), request.getFriendEmail()))
            return ResponseEntity.badRequest().body("Invitation does not exist.");

        friendInvitationRepository.deleteByUserEmailAndFriendEmail(request.getEmail(), request.getFriendEmail());

        return ResponseEntity.ok().body("Invitation removed.");
    }
}
