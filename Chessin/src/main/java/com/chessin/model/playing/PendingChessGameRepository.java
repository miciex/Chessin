package com.chessin.model.playing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public interface PendingChessGameRepository extends JpaRepository<PendingChessGame, Long> {
    ArrayList<PendingChessGame> findAllByTimeControlAndIncrement (int timeControl, int increment);
}
