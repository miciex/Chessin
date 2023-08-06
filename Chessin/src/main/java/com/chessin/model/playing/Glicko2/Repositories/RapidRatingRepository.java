package com.chessin.model.playing.Glicko2.Repositories;

import com.chessin.model.playing.Glicko2.Entities.ClassicalRating;
import com.chessin.model.playing.Glicko2.Entities.RapidRating;
import com.chessin.model.register.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RapidRatingRepository extends JpaRepository<RapidRating, Long> {
    Optional<RapidRating> findByUser(User user);
}
