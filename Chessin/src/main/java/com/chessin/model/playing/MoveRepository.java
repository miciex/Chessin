package com.chessin.model.playing;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
@Transactional
public interface MoveRepository extends JpaRepository<Move, Long> {
}
