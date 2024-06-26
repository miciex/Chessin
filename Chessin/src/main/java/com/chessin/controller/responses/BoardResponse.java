package com.chessin.controller.responses;

import com.chessin.model.playing.Board;
import com.chessin.model.playing.GameResults;
import com.chessin.model.playing.GameType;
import com.chessin.model.playing.Move;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BoardResponse {
    ArrayList<MoveResponse> moves;
    boolean whiteTurn;
    String whiteEmail;
    String blackEmail;
    HashMap<Integer, Integer> position;
    ArrayList<HashMap<Integer, Integer>> positions;
    int movesTo50MoveRule;
    int[] movedPieces = new int[64];
    int[] availableCastles;
    GameResults gameResult;
    int[] visualBoard;
    String startBoard;
    long whiteTime;
    long blackTime;
    long lastMoveTime;
    private GameType gameType;
    private double whiteRating;
    private double blackRating;
    private double whiteRatingChange;
    private double blackRatingChange;
    private boolean isRated;

    public static BoardResponse fromBoard(Board board)
    {
        BoardResponse response = BoardResponse.builder()
                .whiteTurn(board.isWhiteTurn())
                .whiteEmail(board.getWhiteEmail())
                .blackEmail(board.getBlackEmail())
                .position(board.getPosition())
                .positions(board.getPositions())
                .movesTo50MoveRule(board.getMovesTo50MoveRule())
                .movedPieces(board.getMovedPieces())
                .availableCastles(board.getAvailableCastles())
                .gameResult(board.getGameResult())
                .visualBoard(board.getVisualBoard())
                .startBoard(board.getStartBoard())
                .moves(new ArrayList<>())
                .whiteTime(board.getWhiteTime())
                .blackTime(board.getBlackTime())
                .lastMoveTime(board.getLastMoveTime())
                .gameType(board.getGameType())
                .whiteRating(board.getWhiteRating())
                .blackRating(board.getBlackRating())
                .whiteRatingChange(board.getWhiteRatingChange())
                .blackRatingChange(board.getBlackRatingChange())
                .isRated(board.isRated())
                .build();

        board.getMoves().stream().map(MoveResponse::fromMove).forEach(response.moves::add);

        return response;
    }
}
