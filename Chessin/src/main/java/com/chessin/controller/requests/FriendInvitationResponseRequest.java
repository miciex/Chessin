package com.chessin.controller.requests;

import com.chessin.model.playing.InvitationResponseType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FriendInvitationResponseRequest {
    private String friendNickname;
    private InvitationResponseType responseType;
}
