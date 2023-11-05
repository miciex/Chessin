package com.chessin.controller.responses;

import com.chessin.controller.register.UserService;
import com.chessin.model.playing.GameInvitation;
import com.chessin.model.playing.PlayerColor;
import com.chessin.model.register.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GameInvitationResponse {
    private long id;
    private UserResponse user;
    private UserResponse friend;
    Instant date;
    private long timeControl;
    private long increment;
    private boolean isRated;
    private PlayerColor playerColor;

    public static GameInvitationResponse fromGameInvitation(GameInvitation gameInvitation, UserService userService)
    {
        return GameInvitationResponse.builder()
                .id(gameInvitation.getId())
                .user(UserResponse.fromUser(gameInvitation.getUser(), userService, false))
                .friend(UserResponse.fromUser(gameInvitation.getFriend(), userService, false))
                .date(gameInvitation.getDate())
                .timeControl(gameInvitation.getTimeControl())
                .increment(gameInvitation.getIncrement())
                .isRated(gameInvitation.isRated())
                .playerColor(gameInvitation.getPlayerColor())
                .build();
    }
}
