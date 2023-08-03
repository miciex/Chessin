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
public class BlitzRating {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	@OneToOne
	private User userId;
	private double rating;
	private double ratingDeviation;
	private double volatility;
	
	/**
	 * 
	 * @param userId           An value through which you want to identify the rating (not actually used by the algorithm)
	 * @param ratingSystem  An instance of the RatingCalculator object
	 */

	/**
	 * Return the average skill value of the player.
	 * 
	 * @return double
	 */
	public double getRating() {
		return this.rating;
	}

	public void setRating(double rating) {
		this.rating = rating;
	}

	/**
	 * Return the average skill value of the player scaled down
	 * to the scale used by the algorithm's internal workings.
	 * 
	 * @return double
	 */
	public double getGlicko2Rating() {
		return RatingCalculator.convertRatingToGlicko2Scale(this.rating);
	}

	public void setGlicko2Rating(double rating) {
		this.rating = RatingCalculator.convertRatingToOriginalGlickoScale(rating);
	}

	public double getVolatility() {
		return volatility;
	}

	public void setVolatility(double volatility) {
		this.volatility = volatility;
	}

	public double getRatingDeviation() {
		return ratingDeviation;
	}

	public void setRatingDeviation(double ratingDeviation) {
		this.ratingDeviation = ratingDeviation;
	}

	/**
	 * Return the rating deviation of the player scaled down
	 * to the scale used by the algorithm's internal workings.
	 * 
	 * @return double
	 */
	public double getGlicko2RatingDeviation() {
		return RatingCalculator.convertRatingDeviationToGlicko2Scale( ratingDeviation );
	}

	/**
	 * Set the rating deviation, taking in a value in Glicko2 scale.
	 *
	 */
	public void setGlicko2RatingDeviation(double ratingDeviation) {
		this.ratingDeviation = RatingCalculator.convertRatingDeviationToOriginalGlickoScale( ratingDeviation );
	}
	
	/**
	 * Returns a formatted rating for inspection
	 * 
	 * @return {ratinguserId} / {ratingDeviation} / {volatility} / {numberOfResults}
	 */
}
