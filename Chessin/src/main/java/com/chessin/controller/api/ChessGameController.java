package com.chessin.controller.api;

import com.chessin.controller.playing.ChessGameService;
import com.chessin.controller.requests.CancelPendingChessGameRequest;
import com.chessin.controller.requests.PendingChessGameRequest;
import com.chessin.controller.responses.ChessGameResponse;
import com.chessin.model.playing.ChessGame;
import com.chessin.model.playing.ChessGameRepository;
import com.chessin.model.playing.PendingChessGame;
import com.chessin.model.register.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/v1/game")
@RequiredArgsConstructor
public class ChessGameController {
    private final ChessGameRepository chessGameRepository;
    private final ChessGameService chessGameService;
    private final UserRepository userRepository;

    private final ConcurrentHashMap<String, PendingChessGame> pendingGames = new ConcurrentHashMap<>();

    @Transactional
    @PostMapping("/searchNewGame")
    public ResponseEntity<?> searchNewGame(@RequestBody PendingChessGameRequest request) throws InterruptedException {

//        if(pendingGames.containsKey(request.getEmail()))
//        {
//            return ResponseEntity.badRequest().body("User is already searching for a game.");
//        }

        PendingChessGame foundGame = chessGameService.searchNewGame(request, new ArrayList<>(pendingGames.values()));

        if(foundGame != null)
        {
            synchronized(pendingGames.get(foundGame.getUser().getEmail()))
            {
                pendingGames.get(foundGame.getUser().getEmail()).setOpponent(userRepository.findByEmail(request.getEmail()).get());
                pendingGames.get(foundGame.getUser().getEmail()).notifyAll();


                ChessGame game = ChessGame.builder()
                        .whiteUser(foundGame.getUser())
                        .blackUser(userRepository.findByEmail(request.getEmail()).get())
                        .availableCastles(new int[]{0, 0, 0, 0})
                        .timeControl(foundGame.getTimeControl())
                        .increment(foundGame.getIncrement())
                        .build();

                pendingGames.get(foundGame.getUser().getEmail()).wait(100);

                return ResponseEntity.ok().body(ChessGameResponse.fromChessGame(game));
            }
        }

        PendingChessGame pendingChessGame = PendingChessGame.builder()
                .user(userRepository.findByEmail(request.getEmail()).get())
                .timeControl(request.getTimeControl())
                .increment(request.getIncrement())
                .bottomRating(request.getBottomRating())
                .topRating(request.getTopRating())
                .userRating(request.getUserRating())
                .build();

        pendingGames.put(request.getEmail(), pendingChessGame);

        synchronized (pendingGames.get(pendingChessGame.getUser().getEmail())) {
            pendingGames.get(pendingChessGame.getUser().getEmail()).wait(60000);
        }

        synchronized (pendingGames.get(pendingChessGame.getUser().getEmail())) {
            if (pendingGames.get(pendingChessGame.getUser().getEmail()).getOpponent() == null) {
                //pendingChessGameRepository.delete(pendingChessGame);
                pendingGames.remove(pendingChessGame.getUser().getEmail());
                return ResponseEntity.badRequest().body("No opponent found");
            }
            else
            {
                ChessGame game = ChessGame.builder()
                        .whiteUser(pendingChessGame.getUser())
                        .blackUser(pendingChessGame.getOpponent())
                        .availableCastles(new int[]{0,0,0,0})
                        .timeControl(pendingChessGame.getTimeControl())
                        .increment(pendingChessGame.getIncrement())
                        .build();

                chessGameRepository.save(game);
                pendingGames.remove(pendingChessGame.getUser().getEmail());
                return ResponseEntity.ok().body(ChessGameResponse.fromChessGame(game));
            }
        }
    }

    @PostMapping("/cancelSearch")
    public ResponseEntity<?> cancelSearch(@RequestBody CancelPendingChessGameRequest request)
    {
        if(!userRepository.existsByEmail(request.getEmail()))
            return ResponseEntity.badRequest().body("User not found");

        if(pendingGames.get(request.getEmail()) != null)
            pendingGames.remove(request.getEmail());
        else
            return ResponseEntity.badRequest().body("No search found");

        return ResponseEntity.ok().body("Search cancelled");
    }
}
