package com.chessin.model.social;

import com.chessin.model.register.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendInvitationRepository extends JpaRepository<FriendInvitation, Long> {
    boolean existsByUserEmail(String email);
    List<FriendInvitation> findAllByFriend(User user);
    @Modifying
    @Query("delete from FriendInvitation f where f.user.email = ?1 and f.friend.nameInGame = ?2")
    void deleteByUserEmailAndFriendNameInGame(String userEmail, String friendNickname);

    @Modifying
    //@Query("delete from FriendInvitation f where f.user.nameInGame = ?1 and f.friend.email = ?2")
    void deleteByUserNameInGameAndFriendEmail(String userNameInGame, String friendEmail);

    boolean existsByUserEmailAndFriendNameInGame(String userEmail, String friendNickname);

    boolean existsByFriendEmailAndUserNameInGame(String friendEmail, String userNameInGame);

}
