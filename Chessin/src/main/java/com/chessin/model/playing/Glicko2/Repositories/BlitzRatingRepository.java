package com.chessin.model.playing.Glicko2.Repositories;

import com.chessin.model.playing.Glicko2.Entities.BlitzRating;
import com.chessin.model.playing.Glicko2.Entities.RapidRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlitzRatingRepository extends JpaRepository<BlitzRating, Long> {
}
