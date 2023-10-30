package com.chessin.controller.playing;

import com.chessin.controller.requests.PendingChessGameRequest;
import com.chessin.controller.requests.SubmitMoveRequest;
import com.chessin.controller.responses.MoveResponse;
import com.chessin.model.playing.*;
import com.chessin.model.playing.Glicko2.Entities.*;
import com.chessin.model.playing.Glicko2.RatingCalculator;
import com.chessin.model.playing.Glicko2.Repositories.BlitzRatingRepository;
import com.chessin.model.playing.Glicko2.Repositories.BulletRatingRepository;
import com.chessin.model.playing.Glicko2.Repositories.ClassicalRatingRepository;
import com.chessin.model.playing.Glicko2.Repositories.RapidRatingRepository;
import com.chessin.model.playing.Glicko2.Result;
import com.chessin.model.utils.Convert;
import com.chessin.model.utils.HelpMethods;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChessGameService {
    private final ChessGameRepository chessGameRepository;
    private final MoveRepository moveRepository;
    private final ClassicalRatingRepository classicalRatingRepository;
    private final RapidRatingRepository rapidRatingRepository;
    private final BlitzRatingRepository blitzRatingRepository;
    private final BulletRatingRepository bulletRatingRepository;
    private final RatingCalculator ratingCalculator = new RatingCalculator();

    public PendingChessGame searchNewGame(PendingChessGameRequest request, ArrayList<PendingChessGame> pendingGames){
        List<PendingChessGame> matchingGames = pendingGames.stream()
                .filter(game -> game.getTimeControl() == request.getTimeControl() && game.getIncrement() == request.getIncrement())
                .toList();

        for(PendingChessGame game : matchingGames){
            if(game.getBottomRating() <= request.getUserRating() && game.getTopRating() >= request.getUserRating() && game.isRated() == request.isRated()){
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
            board.setWhiteTime(board.getWhiteTime() - Math.abs(board.getLastMoveTime() - now));
        else
            board.setBlackTime(board.getBlackTime() - Math.abs(board.getLastMoveTime() - now));

        return board;
    }

    public Board submitMove(SubmitMoveRequest request, Board board, ChessGame game){
        Move move = new Move(game, board.getPosition(), request.getStartField(), request.getEndField(), request.getPromotePiece());

        long now = Instant.now().toEpochMilli();
        if(board.getMoves().size()>0) {
            if (board.isWhiteTurn()) {
                board.setWhiteTime(board.getLastMoveTimeForColor().orElse(game.getTimeControl()) - Math.abs(board.getLastMoveTime() - now) + game.getIncrement());
                move.setRemainingTime(board.getWhiteTime());
            } else {
                board.setBlackTime(board.getLastMoveTimeForColor().orElse(game.getTimeControl()) - Math.abs(board.getLastMoveTime() - now) + game.getIncrement());
                move.setRemainingTime(board.getBlackTime());
            }
        }
        else
        {
            move.setRemainingTime(game.getTimeControl() + game.getIncrement());
        }

        board.makeMove(move);
        board.setMovesTo50MoveRule(CheckGameResults.draw50MoveRuleCheck(move, board.getMovesTo50MoveRule()));
        board.setWhiteTurn(!board.isWhiteTurn());
        board.setGameResult(board.checkGameResult());
        board.setVisualBoard(Convert.mapToBoard(board.getPosition()));
        move.setAvailableCastles(board.getAvailableCastles());
        move.setPosition(board.getPosition());

        board.setLastMoveTime(now);

        moveRepository.save(move);

        return board;
    }

    @Transactional
    public Board updateRatings(ChessGame game, Board board)
    {
        Rating whiteRating, blackRating;

        switch (game.getGameType()) {
            case CLASSICAL -> {
                whiteRating = classicalRatingRepository.findByUser(game.getWhiteUser()).orElse(new ClassicalRating(game.getWhiteUser(), ratingCalculator));
                blackRating = classicalRatingRepository.findByUser(game.getBlackUser()).orElse(new ClassicalRating(game.getBlackUser(), ratingCalculator));
            }
            case RAPID -> {
                whiteRating = rapidRatingRepository.findByUser(game.getWhiteUser()).orElse(new RapidRating(game.getWhiteUser(), ratingCalculator));
                blackRating = rapidRatingRepository.findByUser(game.getBlackUser()).orElse(new RapidRating(game.getBlackUser(), ratingCalculator));
            }
            case BLITZ -> {
                whiteRating = blitzRatingRepository.findByUser(game.getWhiteUser()).orElse(new BlitzRating(game.getWhiteUser(), ratingCalculator));
                blackRating = blitzRatingRepository.findByUser(game.getBlackUser()).orElse(new BlitzRating(game.getBlackUser(), ratingCalculator));
            }
            case BULLET -> {
                whiteRating = bulletRatingRepository.findByUser(game.getWhiteUser()).orElse(new BulletRating(game.getWhiteUser(), ratingCalculator));
                blackRating = bulletRatingRepository.findByUser(game.getBlackUser()).orElse(new BulletRating(game.getBlackUser(), ratingCalculator));
            }
            default -> throw new IllegalStateException("Unexpected value: " + game.getGameType());
        }

        double whiteRatingBefore = whiteRating.getRating(), blackRatingBefore = blackRating.getRating();

        if(board.getGameResult() == GameResults.MATE)
        {
            if(board.isWhiteTurn())
                ratingCalculator.updateRatings(new Result(blackRating, whiteRating));
            else
                ratingCalculator.updateRatings(new Result(whiteRating, blackRating));
        }
        else if(Arrays.asList(GameResults.BLACK_RESIGN, GameResults.BLACK_TIMEOUT).contains(game.getGameResult()))
        {
            ratingCalculator.updateRatings(new Result(whiteRating, blackRating));
        }
        else if(Arrays.asList(GameResults.WHITE_RESIGN, GameResults.WHITE_TIMEOUT).contains(game.getGameResult()))
        {
            ratingCalculator.updateRatings(new Result(blackRating, whiteRating));
        }
        else if(Arrays.asList(GameResults.DRAW_AGREEMENT, GameResults.DRAW_50_MOVE_RULE, GameResults.INSUFFICIENT_MATERIAL, GameResults.STALEMATE).contains(game.getGameResult()))
        {
            ratingCalculator.updateRatings(new Result(whiteRating, blackRating, true));
        }

        switch (game.getGameType()) {
            case CLASSICAL -> {
                classicalRatingRepository.saveAndFlush((ClassicalRating) whiteRating);
                classicalRatingRepository.saveAndFlush((ClassicalRating) blackRating);
            }
            case RAPID -> {
                rapidRatingRepository.saveAndFlush((RapidRating) whiteRating);
                rapidRatingRepository.saveAndFlush((RapidRating) blackRating);
            }
            case BLITZ -> {
                blitzRatingRepository.saveAndFlush((BlitzRating) whiteRating);
                blitzRatingRepository.saveAndFlush((BlitzRating) blackRating);
            }
            case BULLET -> {
                bulletRatingRepository.saveAndFlush((BulletRating) whiteRating);
                bulletRatingRepository.saveAndFlush((BulletRating) blackRating);
            }
            default -> throw new IllegalStateException("Unexpected value: " + game.getGameType());
        }

        game.setWhiteRating(whiteRatingBefore);
        game.setBlackRating(blackRatingBefore);
        game.setWhiteRatingChange(whiteRating.getRating() - whiteRatingBefore);
        game.setBlackRatingChange(blackRating.getRating() - blackRatingBefore);
        board.setWhiteRating(whiteRatingBefore);
        board.setBlackRating(blackRatingBefore);
        board.setWhiteRatingChange(whiteRating.getRating() - whiteRatingBefore);
        board.setBlackRatingChange(blackRating.getRating() - blackRatingBefore);
        board.setRated(game.isRated());

        chessGameRepository.updateRating(game.getId(), whiteRatingBefore, blackRatingBefore, board.getWhiteRatingChange(), board.getBlackRatingChange());

        return board;
    }
}
