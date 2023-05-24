package com.chessin.game;

import com.chessin.security.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Board {
    @OneToOne
    User whitePlayer;
    @OneToOne
    User blackPlayer;
    ArrayList<Move> moves;
    boolean whiteTurn;
    /**
     * Position given as a FEN string.
     */
    String position;
    /**
     * Positions given as a FEN string.
     */
    ArrayList<String> positions;
    int movesTo50MoveRule;
    int[] movedPieces = new int[64];
    int[] availableCastles;
}
