package com.chessin.model.playing;

import com.chessin.model.register.user.User;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;

@Entity
@Data
public class ChessGame {
    @Id
    private long id;
    @OneToOne
    private User whiteUser;
    @OneToOne
    private User blackUser;
    @OneToMany
    private ArrayList<Move> moves;
}
