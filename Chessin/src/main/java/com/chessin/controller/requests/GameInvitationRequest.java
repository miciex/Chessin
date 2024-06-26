package com.chessin.controller.requests;

import com.chessin.model.playing.PlayerColor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
public class GameInvitationRequest {
    private String friendNickname;
    private long timeControl;
    private long increment;
    private boolean isRated;
    private PlayerColor playerColor;
}
