package com.chessin.controller.responses;

import com.chessin.model.playing.ChessGame;
import com.chessin.model.playing.GameType;
import com.chessin.model.playing.Glicko2.Repositories.BlitzRatingRepository;
import com.chessin.model.playing.Glicko2.Repositories.BulletRatingRepository;
import com.chessin.model.playing.Glicko2.Repositories.ClassicalRatingRepository;
import com.chessin.model.playing.Glicko2.Repositories.RapidRatingRepository;
import com.chessin.model.playing.Move;
import com.chessin.model.register.user.User;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class ChessGameResponse {
    private long id;
    private UserResponse whiteUser;
    private UserResponse blackUser;
    private List<MoveResponse> moves;
    private int[] availableCastles;
    private long timeControl;
    private long increment;
    private String startBoard;
    private boolean whiteStarts;
    private GameType gameType;
    private double whiteRating;
    private double blackRating;
    private double whiteRatingChange;
    private double blackRatingChange;
    private boolean isRated;
    private long startTime;

    public static ChessGameResponse fromChessGame(ChessGame game, ClassicalRatingRepository classicalRatingRepository, RapidRatingRepository rapidRatingRepository, BlitzRatingRepository blitzRatingRepository, BulletRatingRepository bulletRatingRepository){
        ChessGameResponse response = ChessGameResponse.builder()
                .id(game.getId())
                .whiteUser(UserResponse.fromUser(game.getWhiteUser(), classicalRatingRepository, rapidRatingRepository, blitzRatingRepository, bulletRatingRepository, false))
                .blackUser(UserResponse.fromUser(game.getBlackUser(), classicalRatingRepository, rapidRatingRepository, blitzRatingRepository, bulletRatingRepository, false))
                .moves(new ArrayList<>())
                .availableCastles(game.getAvailableCastles())
                .timeControl(game.getTimeControl())
                .increment(game.getIncrement())
                .startBoard(game.getStartBoard())
                .whiteStarts(game.isWhiteStarts())
                .gameType(game.getGameType())
                .whiteRating(game.getWhiteRating())
                .blackRating(game.getBlackRating())
                .whiteRatingChange(game.getWhiteRatingChange())
                .blackRatingChange(game.getBlackRatingChange())
                .isRated(game.isRated())
                .startTime(game.getStartTime())
                .build();

        if(game.getMoves() != null)
            game.getMoves().stream().map(MoveResponse::fromMove).forEach(response.moves::add);
        else
            response.moves = new ArrayList<>();

        return response;
    }
}
