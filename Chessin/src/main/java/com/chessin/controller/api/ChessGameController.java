package com.chessin.controller.api;

import com.chessin.controller.playing.ChessGameService;
import com.chessin.controller.requests.PendingChessGameRequest;
import com.chessin.model.playing.ChessGame;
import com.chessin.model.playing.ChessGameRepository;
import com.chessin.model.playing.PendingChessGame;
import com.chessin.model.register.user.User;
import com.chessin.model.register.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequiredArgsConstructor
public class ChessGameController {
    private final ChessGameRepository chessGameRepository;
    private final ChessGameService chessGameService;
    private final UserRepository userRepository;

    private final ConcurrentHashMap<User, PendingChessGame> pendingGames = new ConcurrentHashMap<>();

    @Transactional
    @PostMapping("api/v1/game/searchNewGame")
    public ResponseEntity<?> searchNewGame(@RequestBody PendingChessGameRequest request) throws InterruptedException {
            PendingChessGame foundGame = chessGameService.searchNewGame(request, new ArrayList<>(pendingGames.values()));

            if(foundGame != null)
            {
                synchronized(pendingGames.get(foundGame.getUser()))
                {
                    pendingGames.get(foundGame.getUser()).setOpponent(userRepository.findByEmail(request.getEmail()).get());
                    pendingGames.get(foundGame.getUser()).notifyAll();

                    pendingGames.get(foundGame.getUser()).wait(100);

                    ChessGame game = ChessGame.builder()
                            .whiteUser(foundGame.getUser())
                            .blackUser(userRepository.findByEmail(request.getEmail()).get())
                            .availableCastles(new int[]{0, 0, 0, 0})
                            .timeControl(foundGame.getTimeControl())
                            .increment(foundGame.getIncrement())
                            .build();
                    return ResponseEntity.ok().body(game);
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

            pendingGames.put(userRepository.findByEmail(request.getEmail()).get(), pendingChessGame);

            synchronized (pendingGames.get(pendingChessGame.getUser())) {
                pendingGames.get(pendingChessGame.getUser()).wait(10000);
            }

            synchronized (pendingGames.get(pendingChessGame.getUser())) {
                if (pendingGames.get(pendingChessGame.getUser()).getOpponent() == null) {
                    //pendingChessGameRepository.delete(pendingChessGame);
                    pendingGames.remove(pendingChessGame.getUser());
                    return ResponseEntity.badRequest().body("No opponent found");
                }
            }

            ChessGame game = ChessGame.builder()
                    .whiteUser(pendingChessGame.getUser())
                    .blackUser(pendingChessGame.getOpponent())
                    .availableCastles(new int[]{0,0,0,0})
                    .timeControl(pendingChessGame.getTimeControl())
                    .increment(pendingChessGame.getIncrement())
                    .build();

            chessGameRepository.save(game);
            pendingGames.remove(pendingChessGame.getUser());
            return ResponseEntity.ok().body(game);
    }
}
