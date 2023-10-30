package com.chessin.controller.requests;

import com.chessin.model.playing.ResponseType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RespondToDrawOfferRequest {
    private long gameId;
    private ResponseType responseType;
}
