package com.chessin.controller.responses;

import com.chessin.model.social.FriendInvitation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FriendInvitationResponse {
    private String nameInGame;
    Date date;

    public static FriendInvitationResponse fromFriendInvitation(FriendInvitation friendInvitation){
        return FriendInvitationResponse
                .builder()
                .nameInGame(friendInvitation.getFriend().getNameInGame())
                .date(Date.from(friendInvitation.getDate()))
                .build();
    }
}
