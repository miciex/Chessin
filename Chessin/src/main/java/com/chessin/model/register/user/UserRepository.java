package com.chessin.model.register.user;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.awt.print.Pageable;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByNameInGame(String nameInGame);
    Optional<User> findByNameInGame(String nameInGame);
    List<User> findByNameInGameContaining(String nickname);
    List<User> findAllByNameInGameContaining(String nickname, PageRequest pageRequest);

    @Modifying
    @Query(value = "UPDATE User cg SET cg.password = :password WHERE cg.email = :email")
    void updatePasswordByEmail(String email, String password);
}
