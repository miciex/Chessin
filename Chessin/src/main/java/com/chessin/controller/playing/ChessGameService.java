package com.chessin.controller.playing;

import com.chessin.controller.requests.PendingChessGameRequest;
import com.chessin.controller.requests.SubmitMoveRequest;
import com.chessin.controller.responses.MoveResponse;
import com.chessin.model.playing.*;
import com.chessin.model.utils.Convert;
import com.chessin.model.utils.HelpMethods;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChessGameService {
    private final ChessGameRepository chessGameRepository;
    private final MoveRepository moveRepository;

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

    public boolean validateMoves(List<MoveResponse> moves, Board board){
        ArrayList<MoveResponse> movesToCheck = new ArrayList<>();

        board.getMoves().stream().map(MoveResponse::fromMove).forEach(movesToCheck::add);

        if(moves.size() != movesToCheck.size())
            return false;

        for(int i = 0; i < moves.size(); i++){
            if(!moves.get(i).equals(movesToCheck.get(i)))
                return false;
        }

        return true;
    }

    public Board calculateTime(Board board)
    {
        long now = Instant.now().toEpochMilli();

        if(board.isWhiteTurn())
            now = board.getWhiteTime() - Math.abs(board.getLastMoveTime() - now);
        else
            now = board.getBlackTime() - Math.abs(board.getLastMoveTime() - now);

        board.setLastMoveTime(now);

        return board;
    }

    public Board submitMove(SubmitMoveRequest request, Board board, ChessGame game){

        Move move = new Move(game, board.getPosition(), request.getStartField(), request.getEndField(), request.getPromotePiece());
        board.makeMove(move);
        board.setMovesTo50MoveRule(CheckGameResults.draw50MoveRuleCheck(move, board.getMovesTo50MoveRule()));
        board.setWhiteTurn(!board.isWhiteTurn());
        board.setGameResult(board.checkGameResult());
        board.setVisualBoard(Convert.mapToBoard(board.getPosition()));;

        long now = Instant.now().toEpochMilli();

        if(!board.isWhiteTurn())
            board.setWhiteTime(board.getWhiteTime() - Math.abs(board.getLastMoveTime() - now) + game.getIncrement());
        else
            board.setBlackTime(board.getBlackTime() - Math.abs(board.getLastMoveTime() - now) + game.getIncrement());

        board.setLastMoveTime(now);

        moveRepository.save(move);

        return board;
    }
}
