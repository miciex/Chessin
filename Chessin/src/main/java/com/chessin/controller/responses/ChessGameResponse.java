package com.chessin.controller.responses;

import com.chessin.model.playing.ChessGame;
import com.chessin.model.playing.Move;
import com.chessin.model.register.user.User;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.ArrayList;

@Data
@Builder
@AllArgsConstructor
public class ChessGameResponse {
    private long id;
    private UserResponse whiteUser;
    private UserResponse blackUser;
    private ArrayList<MoveResponse> moves;
    private int[] availableCastles;
    private long timeControl;
    private long increment;
    private String startBoard;
    private boolean whiteStarts;

    public static ChessGameResponse fromChessGame(ChessGame game){
        ChessGameResponse response = ChessGameResponse.builder()
                .id(game.getId())
                .whiteUser(UserResponse.fromUser(game.getWhiteUser()))
                .blackUser(UserResponse.fromUser(game.getBlackUser()))
                .moves(new ArrayList<>())
                .availableCastles(game.getAvailableCastles())
                .timeControl(game.getTimeControl())
                .increment(game.getIncrement())
                .startBoard(game.getStartBoard())
                .whiteStarts(game.isWhiteStarts())
                .build();

        if(game.getMoves() != null)
            game.getMoves().stream().map(MoveResponse::fromMove).forEach(response.moves::add);

        return response;
    }
}
