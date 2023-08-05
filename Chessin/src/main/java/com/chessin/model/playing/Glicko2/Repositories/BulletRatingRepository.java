package com.chessin.model.playing.Glicko2.Repositories;

import com.chessin.model.playing.Glicko2.Entities.BlitzRating;
import com.chessin.model.playing.Glicko2.Entities.BulletRating;
import com.chessin.model.register.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BulletRatingRepository extends JpaRepository<BulletRating, Long> {
    Optional<BulletRating> findByUser(User user);
}
