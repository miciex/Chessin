package com.chessin.controller.api;

import com.chessin.controller.playing.ChessGameService;
import com.chessin.controller.register.UserService;
import com.chessin.controller.requests.*;
import com.chessin.controller.responses.*;
import com.chessin.model.playing.*;
import com.chessin.model.playing.Glicko2.Repositories.BlitzRatingRepository;
import com.chessin.model.playing.Glicko2.Repositories.BulletRatingRepository;
import com.chessin.model.playing.Glicko2.Repositories.ClassicalRatingRepository;
import com.chessin.model.playing.Glicko2.Repositories.RapidRatingRepository;
import com.chessin.model.register.configuration.JwtService;
import com.chessin.model.register.user.User;
import com.chessin.model.register.user.UserRepository;
import com.chessin.model.utils.Constants;
import com.chessin.model.utils.HelpMethods;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/game")
@RequiredArgsConstructor
@Transactional
public class ChessGameController {
    private final ChessGameService service;
    private final JwtService jwtService;

    @PostMapping("/searchNewGame")
    public ResponseEntity<?> searchNewGame(@RequestBody PendingChessGameRequest request, HttpServletRequest servlet) throws InterruptedException {

        String email = jwtService.extractUsername(servlet.getHeader("Authorization").substring(7));

        return service.searchNewGame(request, email);
    }

    @PostMapping("/cancelSearch")
    public ResponseEntity<?> cancelSearch(HttpServletRequest servlet)
    {
        String email = jwtService.extractUsername(servlet.getHeader("Authorization").substring(7));

        return service.cancelSearch(email);
    }

    @PostMapping("/ping/{gameId}")
    public ResponseEntity<?> ping(@PathVariable String gameId, HttpServletRequest servlet) throws InterruptedException {
        String email = jwtService.extractUsername(servlet.getHeader("Authorization").substring(7));

        long id;
        try {
            id = Long.parseLong(gameId);
        }
        catch (NumberFormatException e)
        {
            return ResponseEntity.badRequest().body(MessageResponse.of("Invalid game id"));
        }

        return service.ping(id, email);
    }

    @PostMapping("/listenForDisconnection/{gameId}")
    public ResponseEntity<?> listenForDisconnection(@PathVariable String gameId, HttpServletRequest servlet) throws InterruptedException {
        String email = jwtService.extractUsername(servlet.getHeader("Authorization").substring(7));

        long id;

        try {
            id = Long.parseLong(gameId);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(MessageResponse.of("Invalid game id"));
        }

        return service.listenForDisconnection(id, email);
    }

    @PostMapping("/listenForMove")
    public ResponseEntity<?> listenForMove(@RequestBody ListenForMoveRequest request) throws InterruptedException {
        return service.listenForMove(request);
    }

    @PostMapping("/listenForFirstMove/{gameId}")
    public ResponseEntity<?> listenForFirstMove(@PathVariable String gameId) throws InterruptedException {
        long id;

        try {
            id = Long.parseLong(gameId);
        }
        catch (NumberFormatException e)
        {
            return ResponseEntity.badRequest().body(MessageResponse.of("Invalid game id"));
        }

        return service.listenForFirstMove(id);
    }

    @PostMapping("/submitMove")
    public ResponseEntity<?> submitMove(@RequestBody SubmitMoveRequest request, HttpServletRequest servlet) throws InterruptedException {
        String email = jwtService.extractUsername(servlet.getHeader("Authorization").substring(7));

        return service.submitMove(request, email);
    }

    @PostMapping("/listenForResignation/{gameId}")
    public ResponseEntity<?> listenForResignation(@PathVariable String gameId, HttpServletRequest servlet) throws InterruptedException {
        String email = jwtService.extractUsername(servlet.getHeader("Authorization").substring(7));

        long id;

        try {
            id = Long.parseLong(gameId);
        }
        catch (NumberFormatException e)
        {
            return ResponseEntity.badRequest().body(MessageResponse.of("Invalid game id."));
        }

        return service.listenForResignation(id, email);
    }

    @PostMapping("/resign/{gameId}")
    public ResponseEntity<?> resign(@PathVariable String gameId, HttpServletRequest servlet) {
        String email = jwtService.extractUsername(servlet.getHeader("Authorization").substring(7));

        long id;

        try {
            id = Long.parseLong(gameId);
        }
        catch (NumberFormatException e)
        {
            return ResponseEntity.badRequest().body(MessageResponse.of("Invalid game id."));
        }

        return service.resign(id, email);
    }

    @PostMapping("/listenForDrawOffer/{gameId}")
    public ResponseEntity<?> listenForDrawOffer(@PathVariable String gameId, HttpServletRequest servlet) throws InterruptedException {
        String email = jwtService.extractUsername(servlet.getHeader("Authorization").substring(7));

        long id;

        try {
            id = Long.parseLong(gameId);
        }
        catch (NumberFormatException e)
        {
            return ResponseEntity.badRequest().body(MessageResponse.of("Invalid game id."));
        }

        return service.listenForDrawOffer(id, email);
    }

    @PostMapping("/offerDraw/{gameId}")
    public ResponseEntity<?> offerDraw(@PathVariable String gameId, HttpServletRequest servlet) throws InterruptedException {
        String email = jwtService.extractUsername(servlet.getHeader("Authorization").substring(7));

        long id;

        try {
            id = Long.parseLong(gameId);
        }
        catch (NumberFormatException e)
        {
            return ResponseEntity.badRequest().body(MessageResponse.of("Invalid game id."));
        }

        return service.offerDraw(id, email);
    }

    @PostMapping("/respondToDrawOffer")
    public ResponseEntity<?> respondToDrawOffer(@RequestBody RespondToDrawOfferRequest request, HttpServletRequest servlet)
    {
        String email = jwtService.extractUsername(servlet.getHeader("Authorization").substring(7));

        return service.respondToDrawOffer(request, email);
    }

    @PostMapping("/cancelDrawOffer/{gameId}")
    public ResponseEntity<?> cancelDrawOffer(@PathVariable String gameId, HttpServletRequest servlet)
    {
        String email = jwtService.extractUsername(servlet.getHeader("Authorization").substring(7));

        long id;

        try {
            id = Integer.parseInt(gameId);
        }
        catch (NumberFormatException e)
        {
            return ResponseEntity.badRequest().body(MessageResponse.of("Invalid game id."));
        }

        return service.cancelDrawOffer(id, email);
    }

    @PostMapping("/getGame/{gameId}")
    public ResponseEntity<?> getGame(@PathVariable("gameId") String gameId)
    {
        long id;
        try{
            id = Long.parseLong(gameId);
        }
        catch (NumberFormatException e)
        {
            return ResponseEntity.badRequest().body(MessageResponse.of("Invalid game id."));
        }

        return service.getGame(id);
    }

    @PostMapping("/getGameByUsername/{username}")
    public ResponseEntity<?> getGameByUsername(@PathVariable String username)
    {
        return service.getGameByUsername(username);
    }

    @PostMapping("/getBoardByUsername/{username}")
    public ResponseEntity<?> getBoardByUsername(@PathVariable String username)
    {
        return service.getBoardByUsername(username);
    }

    @PostMapping("/getBoardByGameId/{gameId}")
    public ResponseEntity<?> getBoardByGameId(@PathVariable String gameId)
    {
        long id;
        try{
            id = Long.parseLong(gameId);
        }
        catch (NumberFormatException e)
        {
            return ResponseEntity.badRequest().body(MessageResponse.of("Wrong game id."));
        }

        return service.getBoardByGameId(id);
    }

    @PostMapping("/isUserPlaying/{username}")
    public ResponseEntity<?> isUserPlaying(@PathVariable String username)
    {
        return service.isUserPlaying(username);
    }

    @PostMapping("/isUserPlayingTimeControl/{username}/{timeControl}/{increment}")
    public ResponseEntity<?> isUserPlayingTimeControl(@PathVariable String username, @PathVariable int timeControl, @PathVariable int increment)
    {
        return service.isUserPlayingTimeControl(username, timeControl, increment);
    }

    @PostMapping("/inviteFriend")
    public ResponseEntity<?> inviteFriend(@RequestBody GameInvitationRequest request, HttpServletRequest servlet) throws InterruptedException {
        String email = jwtService.extractUsername(servlet.getHeader("Authorization").substring(7));

        return service.inviteFriend(request, email);
    }

    @PostMapping("/respondToGameInvitation")
    public ResponseEntity<?> respondToGameInvitation(@RequestBody GameInvitationResponseRequest request, HttpServletRequest servlet) {
        String email = jwtService.extractUsername(servlet.getHeader("Authorization").substring(7));

        return service.respondToGameInvitation(request, email);
    }

    @PostMapping("/checkGameInvitations")
    public ResponseEntity<?> checkGameInvitations(HttpServletRequest servlet)
    {
        String email = jwtService.extractUsername(servlet.getHeader("Authorization").substring(7));

        return service.checkGameInvitations(email);
    }
}