package com.chessin.controller.api;

import com.chessin.controller.register.UserService;
import com.chessin.controller.requests.FriendInvitationRequest;
import com.chessin.controller.requests.FriendInvitationResponseRequest;
import com.chessin.controller.requests.SetActiveRequest;
import com.chessin.controller.responses.ChessGameResponse;
import com.chessin.controller.responses.FriendInvitationResponse;
import com.chessin.controller.responses.ResponseMessage;
import com.chessin.model.playing.ChessGame;
import com.chessin.model.playing.ChessGameRepository;
import com.chessin.model.playing.Glicko2.Repositories.BlitzRatingRepository;
import com.chessin.model.playing.Glicko2.Repositories.BulletRatingRepository;
import com.chessin.model.playing.Glicko2.Repositories.ClassicalRatingRepository;
import com.chessin.model.playing.Glicko2.Repositories.RapidRatingRepository;
import com.chessin.model.register.configuration.JwtService;
import com.chessin.model.register.user.User;
import com.chessin.controller.responses.UserResponse;
import com.chessin.model.register.user.UserRepository;
import com.chessin.model.social.FriendInvitation;
import com.chessin.model.social.FriendInvitationRepository;
import com.chessin.model.playing.ResponseType;
import com.chessin.model.utils.Constants;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    private final FriendInvitationRepository friendInvitationRepository;
    private final ChessGameRepository chessGameRepository;
    private final ClassicalRatingRepository classicalRatingRepository;
    private final RapidRatingRepository rapidRatingRepository;
    private final BlitzRatingRepository blitzRatingRepository;
    private final BulletRatingRepository bulletRatingRepository;

    @PostMapping("/findByNickname/{nickname}")
    public ResponseEntity<?> findByNickname(@PathVariable String nickname){
        Optional<User> user = userRepository.findByNameInGame(nickname);
        UserResponse userResponse = UserResponse.fromUser(user.orElseThrow(), classicalRatingRepository, rapidRatingRepository, blitzRatingRepository, bulletRatingRepository, false);
        return ResponseEntity.ok().body(userResponse);
    }

    @PostMapping("/findUsersByNickname/{nickname}")
    public ResponseEntity<?> findUsersByNickname(@PathVariable String nickname)
    {
        List<User> users = userRepository.findByNameInGameContaining(nickname);
        List<UserResponse> responses = new ArrayList<>();

        users.stream().map((User user) -> UserResponse.fromUser(user, classicalRatingRepository, rapidRatingRepository, blitzRatingRepository, bulletRatingRepository, false)).forEach(responses::add);

        return ResponseEntity.ok().body(responses);
    }

    @PostMapping("/setActive")
    public ResponseEntity<?> setActive(@RequestBody SetActiveRequest request, HttpServletRequest servlet) {
        String email = jwtService.extractUsername(servlet.getHeader("Authorization").substring(7));

        User user = userService.setActive(email, request.isOnline());
        return user != null ? ResponseEntity.ok().body(user) : ResponseEntity.badRequest().body(ResponseMessage.of("User not found."));
    }

    @PostMapping("/addFriend")
    public ResponseEntity<?> addFriend(@RequestBody FriendInvitationRequest request, HttpServletRequest servlet)
    {
        String email = jwtService.extractUsername(servlet.getHeader("Authorization").substring(7));

        if(!userRepository.existsByEmail(email))
            return ResponseEntity.badRequest().body(ResponseMessage.of("User does not exist."));
        else if(!userRepository.existsByNameInGame(request.getFriendNickname()))
            return ResponseEntity.badRequest().body(ResponseMessage.of("Friend does not exist."));
        else if(email.equals(userRepository.findByNameInGame(request.getFriendNickname()).get().getEmail()))
            return ResponseEntity.badRequest().body(ResponseMessage.of("You cannot add yourself as a friend."));
        else if(friendInvitationRepository.existsByUserEmailAndFriendNameInGame(email, request.getFriendNickname()))
            return ResponseEntity.badRequest().body(ResponseMessage.of("Invitation already sent."));

        friendInvitationRepository.save(FriendInvitation.builder()
                .user(userRepository.findByEmail(email).get())
                .friend(userRepository.findByNameInGame(request.getFriendNickname()).get())
                .date(Instant.now())
                .build());

        return ResponseEntity.ok().body(ResponseMessage.of("Invitation sent"));
    }

    @PostMapping("/checkInvitations")
    public ResponseEntity<?> checkInvitations(HttpServletRequest servlet)
    {
        String email = jwtService.extractUsername(servlet.getHeader("Authorization").substring(7));

        if(!friendInvitationRepository.existsByUserEmail(email))
            return ResponseEntity.badRequest().body(ResponseMessage.of("No invitations"));

        List<FriendInvitation> invitations = friendInvitationRepository.findAllByFriend(userRepository.findByEmail(email).get());

        List<FriendInvitationResponse> responses = new ArrayList<>();

        for(FriendInvitation invitation : invitations)
            responses.add(FriendInvitationResponse.fromFriendInvitation(invitation));

        return ResponseEntity.ok().body(responses);
    }

    @PostMapping("/respondToInvitation")
    @Transactional
    public ResponseEntity<?> respondToInvitation(@RequestBody FriendInvitationResponseRequest request, HttpServletRequest servlet)
    {
        String email = jwtService.extractUsername(servlet.getHeader("Authorization").substring(7));

        if(!friendInvitationRepository.existsByFriendEmailAndUserNameInGame(email, request.getFriendNickname()))
            return ResponseEntity.badRequest().body(ResponseMessage.of("Invitation does not exist."));

        friendInvitationRepository.deleteByUserNameInGameAndFriendEmail(request.getFriendNickname(), email);

        if(request.getResponseType() == ResponseType.ACCEPT)
        {
            User user = userRepository.findByEmail(email).get();
            User friend = userRepository.findByNameInGame(request.getFriendNickname()).get();

            user.getFriends().add(friend);
            friend.getFriends().add(user);

            userRepository.save(user);
            userRepository.save(friend);
        }

        return ResponseEntity.ok().body(ResponseMessage.of("Invitation responded"));
    }

    @PostMapping("/getFriends/{nickname}")
    public ResponseEntity<?> getFriends(@PathVariable String nickname)
    {
        if(!userRepository.existsByNameInGame(nickname))
            return ResponseEntity.badRequest().body(ResponseMessage.of("User does not exist"));

        User user = userRepository.findByNameInGame(nickname).get();

        List<UserResponse> friends = new ArrayList<>();

        for(User friend : user.getFriends())
            friends.add(UserResponse.fromUser(friend, classicalRatingRepository, rapidRatingRepository, blitzRatingRepository, bulletRatingRepository, false));

        return ResponseEntity.ok().body(friends);
    }

    @PostMapping("/removeFriend")
    public ResponseEntity<?> removeFriend(@RequestBody FriendInvitationRequest request, HttpServletRequest servlet)
    {
        String email = jwtService.extractUsername(servlet.getHeader("Authorization").substring(7));

        if(!userRepository.existsByEmail(email))
            return ResponseEntity.badRequest().body(ResponseMessage.of("User does not exist."));
        else if(!userRepository.existsByNameInGame(request.getFriendNickname()))
            return ResponseEntity.badRequest().body(ResponseMessage.of("Friend does not exist."));

        User user = userRepository.findByEmail(email).get();
        User friend = userRepository.findByNameInGame(request.getFriendNickname()).get();

        user.getFriends().remove(friend);
        friend.getFriends().remove(user);

        userRepository.save(user);
        userRepository.save(friend);

        return ResponseEntity.ok().body(ResponseMessage.of("Friend removed."));
    }

    @PostMapping("/removeInvitation")
    public ResponseEntity<?> removeInvitation(@RequestBody FriendInvitationRequest request, HttpServletRequest servlet)
    {
        String email = jwtService.extractUsername(servlet.getHeader("Authorization").substring(7));

        if(!friendInvitationRepository.existsByUserEmailAndFriendNameInGame(email, request.getFriendNickname()))
            return ResponseEntity.badRequest().body(ResponseMessage.of("Invitation does not exist."));

        friendInvitationRepository.deleteByUserEmailAndFriendNameInGame(email, request.getFriendNickname());

        return ResponseEntity.ok().body(ResponseMessage.of("Invitation removed."));
    }

    @PostMapping("/getGames/{nickname}")
    public ResponseEntity<?> getGames(@PathVariable String nickname)
    {
        if(!userRepository.existsByNameInGame(nickname))
            return ResponseEntity.badRequest().body(ResponseMessage.of("User does not exist."));

        List<ChessGameResponse> games = new ArrayList<>();

        chessGameRepository.findAllByWhiteNameInGameOrBlackNameInGame(nickname).stream().map((ChessGame game) -> ChessGameResponse.fromChessGame(game, classicalRatingRepository, rapidRatingRepository, blitzRatingRepository, bulletRatingRepository)).forEach(games::add);

        return ResponseEntity.ok().body(games);
    }

    @PostMapping("/findUserByToken")
    public ResponseEntity<?> findUserByToken(HttpServletRequest servlet)
    {
        String email = jwtService.extractUsername(servlet.getHeader("Authorization").substring(7));

        if(!userRepository.existsByEmail(email))
            return ResponseEntity.badRequest().body(ResponseMessage.of("User does not exist."));

        User user = userRepository.findByEmail(email).get();

        return ResponseEntity.ok().body(UserResponse.fromUser(user, classicalRatingRepository, rapidRatingRepository, blitzRatingRepository, bulletRatingRepository, true));
    }

    @PostMapping("/getUsers/{nickname}/{page}")
    public ResponseEntity<?> getUsers(@PathVariable String nickname, @PathVariable String page)
    {
        int pageInt;
        try
        {
            pageInt = Integer.parseInt(page);

            if(pageInt < 0)
                return ResponseEntity.badRequest().body(ResponseMessage.of("Page must be positive."));
        }
        catch(NumberFormatException e)
        {
            return ResponseEntity.badRequest().body(ResponseMessage.of("Page must be a number."));
        }

        if(!userRepository.existsByNameInGame(nickname))
            return ResponseEntity.badRequest().body(ResponseMessage.of("User does not exist."));

        List<UserResponse> users = new ArrayList<>();

        userRepository.findAllByNameInGameContaining(nickname, PageRequest.of(pageInt, Constants.Application.DEFAULT_PAGE_SIZE)).stream().map((User user) -> UserResponse.fromUser(user, classicalRatingRepository, rapidRatingRepository, blitzRatingRepository, bulletRatingRepository, false)).forEach(users::add);

        return ResponseEntity.ok().body(users);
    }

    @PostMapping("/getFriends/{nickname}/{page}")
    public ResponseEntity<?> getFriends(@PathVariable String nickname, @PathVariable String page)
    {
        int pageInt;
        try
        {
            pageInt = Integer.parseInt(page);

            if(pageInt < 0)
                return ResponseEntity.badRequest().body(ResponseMessage.of("Page must be positive."));
        }
        catch(NumberFormatException e)
        {
            return ResponseEntity.badRequest().body(ResponseMessage.of("Page must be a number."));
        }

        if(!userRepository.existsByNameInGame(nickname))
            return ResponseEntity.badRequest().body(ResponseMessage.of("User does not exist."));

        List<UserResponse> friends = new ArrayList<>();
        userRepository.findByNameInGame(nickname).get().getFriends().stream().map((User user) -> UserResponse.fromUser(user, classicalRatingRepository, rapidRatingRepository, blitzRatingRepository, bulletRatingRepository, false)).forEach(friends::add);

        return ResponseEntity.ok().body(userService.getFriends(pageInt, Constants.Application.DEFAULT_PAGE_SIZE, friends));
    }

    @PostMapping("/getGames/{nickname}/{page}")
    public ResponseEntity<?> getGames(@PathVariable String nickname, @PathVariable String page)
    {
        int pageInt;
        try
        {
            pageInt = Integer.parseInt(page);

            if(pageInt < 0)
                return ResponseEntity.badRequest().body(ResponseMessage.of("Page must be positive."));
        }
        catch(NumberFormatException e)
        {
            return ResponseEntity.badRequest().body(ResponseMessage.of("Page must be a number."));
        }

        if(!userRepository.existsByNameInGame(nickname))
            return ResponseEntity.badRequest().body(ResponseMessage.of("User does not exist."));

        List<ChessGameResponse> games = new ArrayList<>();

        chessGameRepository.findAllByWhiteNameInGameOrBlackNameInGamePage(nickname, PageRequest.of(pageInt, Constants.Application.DEFAULT_PAGE_SIZE)).stream().map((ChessGame game) -> ChessGameResponse.fromChessGame(game, classicalRatingRepository, rapidRatingRepository, blitzRatingRepository, bulletRatingRepository)).forEach(games::add);

        return ResponseEntity.ok().body(games);
    }
}