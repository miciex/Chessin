package com.chessin.controller.requests;

import com.chessin.model.playing.GameType;
import com.chessin.model.register.user.User;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PendingChessGameRequest {
    private String email;
    private int timeControl;
    private int increment;
    private int bottomRating;
    private int topRating;
    private int userRating;
}
