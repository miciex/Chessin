package com.chessin.model.playing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChessGameRepository extends JpaRepository<ChessGame, Long> {
    @Modifying
    @Query(value = "UPDATE ChessGame cg SET cg.gameResult = :gameResult WHERE cg.id = :id")
    void updateGameResult(@Param(value = "id") long id, @Param(value = "gameResult") GameResults gameResult);

    @Modifying
    @Query(value = "UPDATE ChessGame cg SET cg.whiteRating = :whiteRating, cg.blackRating = :blackRating, cg.whiteRatingChange = :whiteRatingChange, cg.blackRatingChange = :blackRatingChange WHERE cg.id = :id")
    void updateRating(@Param(value = "id") long id, @Param(value = "whiteRating") double whiteRating, @Param(value = "blackRating") double blackRating,
                      @Param(value="whiteRatingChange") double whiteRatingChange, @Param(value="blackRatingChange") double blackRatingChange);

    @Query(value = "SELECT cg FROM ChessGame cg WHERE cg.whiteUser.id = :nickname OR cg.blackUser.id = :nickname")
    List<ChessGame> findAllByWhiteNameInGameOrBlackNameInGame(@Param(value = "nickname") String nickname);
}
