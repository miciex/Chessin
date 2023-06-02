package com.chessin.controller.responses;

import com.chessin.model.playing.Board;
import com.chessin.model.playing.GameResults;
import com.chessin.model.playing.Move;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
                .build();

        board.getMoves().stream().map(MoveResponse::fromMove).forEach(response.moves::add);

        return response;
    }
}
