package com.chessin.controller.playing;

import com.chessin.controller.requests.PendingChessGameRequest;
import com.chessin.controller.requests.SubmitMoveRequest;
import com.chessin.controller.responses.MoveResponse;
import com.chessin.model.playing.*;
import com.chessin.model.utils.Convert;
import com.chessin.model.utils.HelpMethods;
import lombok.RequiredArgsConstructor;
import org.hibernate.context.TenantIdentifierMismatchException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChessGameService {
    private final ChessGameRepository chessGameRepository;
    private final MoveRepository moveRepository;

    public PendingChessGame searchNewGame(PendingChessGameRequest request, ArrayList<PendingChessGame> pendingGames) {
        List<PendingChessGame> matchingGames = pendingGames.stream()
                .filter(game -> game.getTimeControl() == request.getTimeControl()
                        && game.getIncrement() == request.getIncrement())
                .toList();

        for (PendingChessGame game : matchingGames) {
            if (game.getBottomRating() <= request.getUserRating() && game.getTopRating() >= request.getUserRating()) {
                return game;
            }
        }

        return null;
    }

    public boolean validateMoves(List<MoveResponse> moves, Board board) {
        ArrayList<MoveResponse> movesToCheck = new ArrayList<>();

        board.getMoves().stream().map(MoveResponse::fromMove).forEach(movesToCheck::add);

        if (moves.size() != movesToCheck.size())
            return false;

        for (int i = 0; i < moves.size(); i++) {
            if (!moves.get(i).equals(movesToCheck.get(i)))
                return false;
        }

        return true;
    }

    public Board calculateTime(Board board, ChessGame game) {
        long now = Instant.now().toEpochMilli();

        if (board.isWhiteTurn()) {
            Optional<Long> time = board.getLastMoveTimeForColor(true, true);
            long time2 = time.map(aLong -> aLong - Math.abs(board.getLastMoveTime() - now) + game.getIncrement()).orElseGet(game::getTimeControl);
            board.setWhiteTime(time2);
        }
        else {
            Optional<Long> time = board.getLastMoveTimeForColor(false, true);
            long time2 = time.map(aLong -> aLong - Math.abs(board.getLastMoveTime() - now) + game.getIncrement()).orElseGet(game::getTimeControl);
            board.setBlackTime(time2);
        }

        return board;
    }

    public Board submitMove(SubmitMoveRequest request, Board board, ChessGame game) {
        Move move = new Move(game, board.getPosition(), request.getStartField(), request.getEndField(),
                request.getPromotePiece());

        long now = Instant.now().toEpochMilli();
        long diff = Math.abs(board.getLastMoveTime() - now);
        long timeControl = game.getTimeControl();
        if (board.isWhiteTurn()) {
            Optional<Long> time = board.getLastMoveTimeForColor(true, game.isWhiteStarts());
            long time2 = time.map(aLong -> aLong - diff + game.getIncrement()).orElse(board.getMoves().size() == 0 ? timeControl + game.getIncrement() : timeControl - diff + game.getIncrement());
            board.setWhiteTime(time2);
            move.setRemainingTime(board.getWhiteTime());
        } else {
            Optional<Long> time = board.getLastMoveTimeForColor(false, game.isWhiteStarts());
            long time2 = time.map(aLong -> aLong - diff + game.getIncrement()).orElse(board.getMoves().size() == 0 ? timeControl + game.getIncrement() : timeControl - diff + game.getIncrement());
            board.setBlackTime(time2);
            move.setRemainingTime(board.getBlackTime());
        }

        board.makeMove(move);
        board.setMovesTo50MoveRule(CheckGameResults.draw50MoveRuleCheck(move, board.getMovesTo50MoveRule()));
        board.setWhiteTurn(!board.isWhiteTurn());
        board.setGameResult(board.checkGameResult());
        board.setVisualBoard(Convert.mapToBoard(board.getPosition()));
        move.setAvailableCastles(board.getAvailableCastles());

        board.setLastMoveTime(now);

        moveRepository.save(move);

        return board;
    }
}
