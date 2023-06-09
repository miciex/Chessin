package com.chessin.controller.requests;

import com.chessin.model.register.user.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CancelPendingChessGameRequest {
    private String accessToken;
}
