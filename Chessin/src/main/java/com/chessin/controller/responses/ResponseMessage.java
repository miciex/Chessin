package com.chessin.controller.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResponseMessage {
    private String message;

    public static ResponseMessage of(String message){
        return ResponseMessage.builder()
                .message(message)
                .build();
    }
}
