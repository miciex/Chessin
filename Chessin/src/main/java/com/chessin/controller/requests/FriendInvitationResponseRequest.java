package com.chessin.controller.requests;

import com.chessin.model.social.FriendInvitationResponseType;
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
    private FriendInvitationResponseType responseType;
}
