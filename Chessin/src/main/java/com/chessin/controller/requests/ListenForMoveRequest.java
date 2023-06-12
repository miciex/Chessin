package com.chessin.controller.requests;

import com.chessin.controller.responses.MoveResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ListenForMoveRequest {
    private long gameId;
    private List<MoveResponse> moves;
}
