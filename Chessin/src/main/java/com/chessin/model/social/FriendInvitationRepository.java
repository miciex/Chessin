package com.chessin.model.social;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendInvitationRepository extends JpaRepository<FriendInvitation, Long> {
    boolean existsByUserEmail(String email);
    List<FriendInvitation> findAllByUserEmail(String email);

    @Modifying
    void deleteByUserEmailAndFriendEmail(String userEmail, String friendEmail);

    boolean existsByUserEmailAndFriendEmail(String userEmail, String friendEmail);
}
