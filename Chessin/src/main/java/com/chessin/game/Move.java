package com.chessin.game;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Move {
    private int movedPiece;
    private int startField;
    private int endField;
    private int takenPiece;
    private int promotePiece;
    private boolean gaveCheck;
    private int takenPieceField;
}
