package com.chessin.model.playing;

import com.chessin.model.register.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.autoconfigure.web.WebProperties;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameInvitation {
    private User user;
    private User friend;
    Instant date;
    private int timeControl;
    private int increment;
    private boolean isRated;
}
