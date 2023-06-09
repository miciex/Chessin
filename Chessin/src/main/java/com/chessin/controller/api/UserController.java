package com.chessin.controller.api;

import com.chessin.controller.register.UserService;
import com.chessin.controller.requests.CheckInvitationsRequest;
import com.chessin.controller.requests.FriendInvitationRequest;
import com.chessin.controller.requests.FriendInvitationResponseRequest;
import com.chessin.controller.requests.SetActiveRequest;
import com.chessin.controller.responses.FriendInvitationResponse;
import com.chessin.model.register.configuration.JwtService;
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
    private final JwtService jwtService;
    FriendInvitationRepository friendInvitationRepository;

    @PostMapping("/findByEmail/{nickname}")
    public ResponseEntity<?> findByNickname(@PathVariable String nickname){
        Optional<User> user = userRepository.findByNameInGame(nickname);
        UserResponse userResponse = UserResponse.fromUser(user.orElseThrow());
        return ResponseEntity.ok().body(userResponse);
    }

    @PostMapping("/setActive")
    public ResponseEntity<?> setActive(@RequestBody SetActiveRequest request) {
        String email = jwtService.extractUsername(request.getAccessToken());

        User user = userService.setActive(email, request.isOnline());
        return user != null ? ResponseEntity.ok().body(user) : ResponseEntity.badRequest().body("User not found.");
    }

    @PostMapping("/addFriend")
    public ResponseEntity<?> addFriend(@RequestBody FriendInvitationRequest request)
    {
        String email = jwtService.extractUsername(request.getAccessToken());

        if(!userRepository.existsByEmail(email))
            return ResponseEntity.badRequest().body("User does not exist");
        else if(!userRepository.existsByEmail(request.getFriendEmail()))
            return ResponseEntity.badRequest().body("Friend does not exist");

        friendInvitationRepository.save(FriendInvitation.builder()
                .user(userRepository.findByEmail(email).get())
                .friend(userRepository.findByEmail(request.getFriendEmail()).get())
                .date(Instant.now())
                .build());

        return ResponseEntity.ok().body("Invitation sent");
    }

    @PostMapping("/checkInvitations")
    public ResponseEntity<?> checkInvitations(@RequestBody CheckInvitationsRequest request)
    {
        String email = jwtService.extractUsername(request.getAccessToken());

        if(!friendInvitationRepository.existsByUserEmail(email))
            return ResponseEntity.badRequest().body("No invitations");

        List<FriendInvitation> invitations = friendInvitationRepository.findAllByUserEmail(email);

        List<FriendInvitationResponse> responses = new ArrayList<>();

        for(FriendInvitation invitation : invitations)
            responses.add(FriendInvitationResponse.fromFriendInvitation(invitation));

        return ResponseEntity.ok().body(responses);
    }

    @PostMapping("/respondToInvitation")
    public ResponseEntity<?> respondToInvitation(@RequestBody FriendInvitationResponseRequest request)
    {
        String email = jwtService.extractUsername(request.getAccessToken());

        if(!friendInvitationRepository.existsByUserEmailAndFriendEmail(email, request.getFriendEmail()))
            return ResponseEntity.badRequest().body("Invitation does not exist.");

        friendInvitationRepository.deleteByUserEmailAndFriendEmail(email, request.getFriendEmail());

        if(request.getResponseType() == FriendInvitationResponseType.ACCEPT)
        {
            User user = userRepository.findByEmail(email).get();
            User friend = userRepository.findByEmail(request.getFriendEmail()).get();

            user.getFriends().add(friend);
            friend.getFriends().add(user);

            userRepository.save(user);
            userRepository.save(friend);
        }

        return ResponseEntity.ok().body("Invitation responded");
    }

    @PostMapping("/getFriends/{email}")
    public ResponseEntity<?> getFriends(@PathVariable String email)
    {
        if(!userRepository.existsByEmail(email))
            return ResponseEntity.badRequest().body("User does not exist");

        User user = userRepository.findByEmail(email).get();

        List<UserResponse> friends = new ArrayList<>();

        for(User friend : user.getFriends())
            friends.add(UserResponse.fromUser(friend));

        return ResponseEntity.ok().body(friends);
    }

    @PostMapping("/removeFriend")
    public ResponseEntity<?> removeFriend(@RequestBody FriendInvitationRequest request)
    {
        String email = jwtService.extractUsername(request.getAccessToken());

        if(!userRepository.existsByEmail(email))
            return ResponseEntity.badRequest().body("User does not exist.");
        else if(!userRepository.existsByEmail(request.getFriendEmail()))
            return ResponseEntity.badRequest().body("Friend does not exist.");

        User user = userRepository.findByEmail(email).get();
        User friend = userRepository.findByEmail(request.getFriendEmail()).get();

        user.getFriends().remove(friend);
        friend.getFriends().remove(user);

        userRepository.save(user);
        userRepository.save(friend);

        return ResponseEntity.ok().body("Friend removed.");
    }

    @PostMapping("/removeInvitation")
    public ResponseEntity<?> removeInvitation(@RequestBody FriendInvitationRequest request)
    {
        String email = jwtService.extractUsername(request.getAccessToken());

        if(!friendInvitationRepository.existsByUserEmailAndFriendEmail(email, request.getFriendEmail()))
            return ResponseEntity.badRequest().body("Invitation does not exist.");

        friendInvitationRepository.deleteByUserEmailAndFriendEmail(email, request.getFriendEmail());

        return ResponseEntity.ok().body("Invitation removed.");
    }
}