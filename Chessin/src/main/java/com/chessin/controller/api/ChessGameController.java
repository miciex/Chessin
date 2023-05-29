package com.chessin.controller.api;

import com.chessin.controller.playing.ChessGameService;
import com.chessin.controller.requests.PendingChessGameRequest;
import com.chessin.model.playing.ChessGame;
import com.chessin.model.playing.ChessGameRepository;
import com.chessin.model.playing.PendingChessGame;
import com.chessin.model.playing.PendingChessGameRepository;
import com.chessin.model.register.user.User;
import com.chessin.model.register.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@RestController
@RequiredArgsConstructor
public class ChessGameController {
    private final ChessGameRepository chessGameRepository;
    private final PendingChessGameRepository pendingChessGameRepository;
    private final ChessGameService chessGameService;
    private final UserRepository userRepository;

    private HashMap<User, PendingChessGame> pendingGames = new HashMap<>();

    @PostMapping("api/v1/game/searchNewGame")
    public ResponseEntity<?> searchNewGame(@RequestBody PendingChessGameRequest request){
        PendingChessGame foundGame = chessGameService.searchNewGame(request);

        if(foundGame != null)
        {
            pendingGames.get(foundGame.getUser()).setOpponent(userRepository.findByEmail(request.getEmail()).get());
            ChessGame game = ChessGame.builder()
                    .whiteUser(foundGame.getUser())
                    .blackUser(userRepository.findByEmail(request.getEmail()).get())
                    .availableCastles(new int[]{0,0,0,0})
                    .build();
            chessGameRepository.save(game);
            pendingGames.get(foundGame.getUser()).notifyAll();
            return ResponseEntity.ok().body(game);
        }

        synchronized (pendingGames)
        {
            PendingChessGame pendingChessGame = PendingChessGame.builder()
                    .user(userRepository.findByEmail(request.getEmail()).get())
                    .timeControl(request.getTimeControl())
                    .increment(request.getIncrement())
                    .bottomRating(request.getBottomRating())
                    .topRating(request.getTopRating())
                    .userRating(request.getUserRating())
                    .build();

            pendingChessGameRepository.save(pendingChessGame);
            pendingGames.put(userRepository.findByEmail(request.getEmail()).get(), pendingChessGame);

            try{
                pendingGames.wait(10000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }

            ChessGame game = ChessGame.builder()
                    .whiteUser(pendingChessGame.getUser())
                    .blackUser(pendingChessGame.getOpponent())
                    .availableCastles(new int[]{0,0,0,0})
                    .build();

            chessGameRepository.save(game);
            pendingChessGameRepository.delete(pendingChessGame);
            pendingGames.remove(pendingChessGame.getUser());
            return ResponseEntity.ok().body(game);
        }
    }
}
