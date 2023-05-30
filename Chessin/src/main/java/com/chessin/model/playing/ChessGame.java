package com.chessin.model.playing;

import com.chessin.model.register.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.ArrayList;

@Entity
@Data
@Builder
@AllArgsConstructor
public class ChessGame {
    @Id
    private long id;
    @ManyToOne(fetch = FetchType.EAGER)
    private User whiteUser;
    @ManyToOne(fetch = FetchType.EAGER)
    private User blackUser;
    @OneToMany(mappedBy = "chessGame", fetch = FetchType.EAGER)
    private ArrayList<Move> moves;
    //eventually change to 4 columns
    private int[] availableCastles;
    private int timeControl;
    private int increment;

    public ChessGame(){
        this.moves = new ArrayList<>();
        this.availableCastles = new int[]{0,0,0,0};
    }
}
