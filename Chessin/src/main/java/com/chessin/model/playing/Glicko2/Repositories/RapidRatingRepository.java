package com.chessin.model.playing.Glicko2.Repositories;

import com.chessin.model.playing.Glicko2.Entities.ClassicalRating;
import com.chessin.model.playing.Glicko2.Entities.RapidRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RapidRatingRepository extends JpaRepository<RapidRating, Long> {
}
