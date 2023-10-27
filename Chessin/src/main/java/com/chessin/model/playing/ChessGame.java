package com.chessin.model.playing;

import com.chessin.model.register.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Builder
@AllArgsConstructor
public class ChessGame {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    @ManyToOne(fetch = FetchType.EAGER)
    private User whiteUser;
    @ManyToOne(fetch = FetchType.EAGER)
    private User blackUser;
    @OneToMany(mappedBy = "chessGame", fetch = FetchType.EAGER)
    private List<Move> moves;
    private int[] availableCastles;
    private long timeControl;
    private long increment;
    private String startBoard;
    private boolean whiteStarts;
    private GameResults gameResult;
    private long startTime;
    private GameType gameType;
    private double whiteRating;
    private double blackRating;
    private double whiteRatingChange;
    private double blackRatingChange;
    private boolean isRated;

    public ChessGame(){
        this.moves = new ArrayList<>();
        this.availableCastles = new int[]{0,0,0,0};
    }
}
