package com.chessin.controller.playing;

import com.chessin.controller.requests.PendingChessGameRequest;
import com.chessin.model.playing.ChessGameRepository;
import com.chessin.model.playing.PendingChessGame;
import com.chessin.model.playing.PendingChessGameRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class ChessGameService {
    private final ChessGameRepository chessGameRepository;
    private final PendingChessGameRepository pendingChessGameRepository;

    public PendingChessGame searchNewGame(PendingChessGameRequest request){
        ArrayList<PendingChessGame> pendingGames = pendingChessGameRepository.findAllByTimeControlAndIncrement(request.getTimeControl(), request.getIncrement());

        for(PendingChessGame pendingGame : pendingGames){
            if(pendingGame.getBottomRating() <= request.getUserRating() && pendingGame.getTopRating() >= request.getUserRating()){
                return pendingGame;
            }
        }

        return null;
    }
}
