package com.chessin.controller.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
public class SubmitMoveRequest {
    private long gameId;
    private int movedPiece;
    private int startField;
    private int endField;
    private int promotePiece;
}
