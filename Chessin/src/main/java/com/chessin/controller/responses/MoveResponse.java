package com.chessin.controller.responses;

import com.chessin.model.playing.ChessGame;
import com.chessin.model.playing.Move;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MoveResponse {
    private int movedPiece;
    private int startField;
    private int endField;
    private int takenPiece;
    private int promotePiece;
    private int takenPieceField;
    int movesTo50MoveRule;
    int[] availableCastles;
    long remainingTime;
    int[] position;

    public static MoveResponse fromMove(Move move)
    {
        return MoveResponse.builder()
                .movedPiece(move.getMovedPiece())
                .startField(move.getStartField())
                .endField(move.getEndField())
                .takenPiece(move.getTakenPiece())
                .promotePiece(move.getPromotePiece())
                .takenPieceField(move.getTakenPieceField())
                .movesTo50MoveRule(move.getMovesTo50MoveRule())
                .availableCastles(move.getAvailableCastles())
                .remainingTime(move.getRemainingTime())
                .position(move.getPosition())
                .build();
    }
}
