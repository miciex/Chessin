package com.chessin.model.social;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendInvitationRepository extends JpaRepository<FriendInvitation, Long> {
    boolean existsByUserEmail(String email);
    List<FriendInvitation> findAllByUserEmail(String email);
}
