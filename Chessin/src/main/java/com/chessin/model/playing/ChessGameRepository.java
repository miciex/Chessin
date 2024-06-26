package com.chessin.model.playing;

import com.chessin.model.register.user.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

    @Modifying
    @Query(value = "UPDATE ChessGame cg SET cg.whiteRatingChange = :whiteRatingChange, cg.blackRatingChange = :blackRatingChange WHERE cg.id = :id")
    void updateRatingChange(@Param(value = "id") long id, @Param(value="whiteRatingChange") double whiteRatingChange, @Param(value="blackRatingChange") double blackRatingChange);

    @Query(value = "SELECT cg FROM ChessGame cg WHERE cg.whiteUser.nameInGame = :nickname OR cg.blackUser.nameInGame = :nickname")
    List<ChessGame> findAllByWhiteNameInGameOrBlackNameInGame(@Param(value = "nickname") String nickname);

    @Query(value = "SELECT cg FROM ChessGame cg WHERE cg.whiteUser.nameInGame = :nickname OR cg.blackUser.nameInGame = :nickname")
    List<ChessGame> findAllByWhiteNameInGameOrBlackNameInGamePage(@Param(value = "nickname") String nickname, Pageable pageable);

    @Modifying
    void deleteById(long id);
}
