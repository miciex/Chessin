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
    private ArrayList<Move> moves;
    private int[] availableCastles;
    private int timeControl;
    private int increment;
    private String startBoard;
    private boolean whiteStarts;

    public static ChessGameResponse fromChessGame(ChessGame game){
        return ChessGameResponse
                .builder()
                .id(game.getId())
                .whiteUser(UserResponse.fromUser(game.getWhiteUser()))
                .blackUser(UserResponse.fromUser(game.getBlackUser()))
                .moves(game.getMoves())
                .availableCastles(game.getAvailableCastles())
                .timeControl(game.getTimeControl())
                .increment(game.getIncrement())
                .startBoard(game.getStartBoard())
                .whiteStarts(game.isWhiteStarts())
                .build();
    }

}
