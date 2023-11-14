package com.chessin.model.playing.Glicko2.Repositories;

import com.chessin.model.playing.Glicko2.Entities.ClassicalRating;
import com.chessin.model.register.user.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@Transactional
public interface ClassicalRatingRepository extends JpaRepository<ClassicalRating, Long> {
    Optional<ClassicalRating> findByUser(User user);
}
