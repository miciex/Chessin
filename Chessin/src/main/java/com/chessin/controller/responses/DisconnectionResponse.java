package com.chessin.controller.responses;

import com.chessin.model.playing.DisconnectionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DisconnectionResponse {
    private DisconnectionStatus disconnectionStatus;
    private long disconnectionTime;
}
