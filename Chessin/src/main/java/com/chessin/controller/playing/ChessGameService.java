package com.chessin.controller.playing;

import com.chessin.controller.requests.PendingChessGameRequest;
import com.chessin.model.playing.ChessGameRepository;
import com.chessin.model.playing.PendingChessGame;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChessGameService {
    private final ChessGameRepository chessGameRepository;

    public PendingChessGame searchNewGame(PendingChessGameRequest request, ArrayList<PendingChessGame> pendingGames){
        List<PendingChessGame> matchingGames = pendingGames.stream()
                .filter(game -> game.getTimeControl() == request.getTimeControl() && game.getIncrement() == request.getIncrement())
                .toList();

        for(PendingChessGame game : matchingGames){
            if(game.getBottomRating() <= request.getUserRating() && game.getTopRating() >= request.getUserRating()){
                return game;
            }
        }

        return null;
    }
}
