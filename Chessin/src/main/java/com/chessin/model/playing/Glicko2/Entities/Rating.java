package com.chessin.model.playing.Glicko2.Entities;

import com.chessin.model.playing.Glicko2.RatingCalculator;
import com.chessin.model.register.user.User;
import jakarta.persistence.*;
import lombok.Data;

@Data
@MappedSuperclass
public abstract class Rating {
    protected double rating;
    protected double ratingDeviation;
    protected double volatility;

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
