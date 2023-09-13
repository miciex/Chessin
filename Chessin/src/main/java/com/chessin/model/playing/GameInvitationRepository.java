package com.chessin.model.playing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameInvitationRepository extends JpaRepository<GameInvitation, Long> {
}
