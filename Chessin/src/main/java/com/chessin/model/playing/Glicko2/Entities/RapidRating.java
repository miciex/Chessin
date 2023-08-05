/*
 * Copyright (C) 2013 Jeremy Gooch <http://www.linkedin.com/in/jeremygooch/>
 *
 * The licence covering the contents of this file is described in the file LICENCE.txt,
 * which should have been included as part of the distribution containing this file.
 */
package com.chessin.model.playing.Glicko2.Entities;

import com.chessin.model.playing.Glicko2.RatingCalculator;
import com.chessin.model.register.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Holds an individual's Glicko-2 rating.
 *
 * <p>Glicko-2 ratings are an average skill value, a standard deviation and a volatility (how consistent the player is).
 * Prof Glickman's paper on the algorithm allows scaling of these values to be more directly comparable with existing rating
 * systems such as Elo or USCF's derivation thereof. This implementation outputs ratings at this larger scale.</p>
 *
 * @author Jeremy Gooch
 */
@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RapidRating extends Rating  {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	@OneToOne
	private User user;

	public RapidRating(User user, RatingCalculator ratingSystem) {
		this.user = user;
		this.rating = ratingSystem.getDefaultRating();
		this.ratingDeviation = ratingSystem.getDefaultRatingDeviation();
		this.volatility = ratingSystem.getDefaultVolatility();
	}
}
