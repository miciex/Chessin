package com.chessin.controller.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MessageResponse {
    private String message;

    public static MessageResponse of(String message){
        return MessageResponse.builder()
                .message(message)
                .build();
    }
}
