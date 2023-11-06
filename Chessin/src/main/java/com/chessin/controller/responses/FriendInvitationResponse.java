package com.chessin.controller.responses;

import com.chessin.controller.register.UserService;
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
    private UserResponse nameInGame;
    Date date;

    public static FriendInvitationResponse fromFriendInvitation(FriendInvitation friendInvitation, UserService userService, boolean isFriend){
        return FriendInvitationResponse
                .builder()
                .nameInGame(UserResponse.fromUser(isFriend ? friendInvitation.getUser() : friendInvitation.getFriend(), userService, false))
                .date(Date.from(friendInvitation.getDate()))
                .build();
    }
}
