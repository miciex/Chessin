package com.chessin.model.playing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChessGameRepository extends JpaRepository<ChessGame, Long> {
    @Modifying
    @Query(value = "UPDATE ChessGame cg SET cg.gameResult = :gameResult WHERE cg.id = :id")
    void updateGameResult(@Param(value = "id") long id, @Param(value = "gameResult") GameResults gameResult);
}
