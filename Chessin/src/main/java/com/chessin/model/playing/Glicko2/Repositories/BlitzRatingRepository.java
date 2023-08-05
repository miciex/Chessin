package com.chessin.model.playing.Glicko2.Repositories;

import com.chessin.model.playing.Glicko2.Entities.BlitzRating;
import com.chessin.model.playing.Glicko2.Entities.RapidRating;
import com.chessin.model.register.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlitzRatingRepository extends JpaRepository<BlitzRating, Long> {
    Optional<BlitzRating> findByUser(User user);
}
