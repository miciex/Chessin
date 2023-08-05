package com.chessin.model.playing;

import com.chessin.model.register.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PendingChessGame {
    private Long id;
    private User user;
    private User opponent;
    private int timeControl;
    private int increment;
    private int bottomRating;
    private int topRating;
    private int userRating;
    private boolean isRated;
}
