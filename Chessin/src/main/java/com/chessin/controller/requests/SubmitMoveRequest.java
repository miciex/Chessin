package com.chessin.controller.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubmitMoveRequest {
    private long gameId;
    private String email;
    private int movedPiece;
    private int startField;
    private int endField;
    private int promotePiece;
    private boolean isDrawOffered;
}
