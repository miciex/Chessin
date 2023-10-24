package com.chessin.controller.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameInvitationRequest {
    private String friendNickname;
    private long timeControl;
    private long increment;
    private boolean isRated;
}
