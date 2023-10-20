package com.chessin.controller.responses;

import com.chessin.model.playing.Glicko2.Entities.BlitzRating;
import com.chessin.model.playing.Glicko2.Entities.BulletRating;
import com.chessin.model.playing.Glicko2.Entities.ClassicalRating;
import com.chessin.model.playing.Glicko2.Entities.RapidRating;
import com.chessin.model.playing.Glicko2.RatingCalculator;
import com.chessin.model.playing.Glicko2.Repositories.BlitzRatingRepository;
import com.chessin.model.playing.Glicko2.Repositories.BulletRatingRepository;
import com.chessin.model.playing.Glicko2.Repositories.ClassicalRatingRepository;
import com.chessin.model.playing.Glicko2.Repositories.RapidRatingRepository;
import com.chessin.model.register.user.User;
import com.chessin.model.utils.Constants.Rating;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class UserResponse {
    private Long id;
    private String firstname;
    private String lastName;
    private String nameInGame;
    private double ratingBlitz;
    private double ratingBullet;
    private double ratingRapid;
    private double ratingClassical;
    private String country;

    public static UserResponse fromUser(User user, ClassicalRatingRepository classicalRatingRepository, RapidRatingRepository rapidRatingRepository, BlitzRatingRepository blitzRatingRepository, BulletRatingRepository bulletRatingRepository){
        return UserResponse.builder()
                .id(user.getId())
                .firstname(user.getFirstname())
                .lastName(user.getLastName())
                .nameInGame(user.getNameInGame())
                .country(user.getCountry())
                .ratingClassical(classicalRatingRepository.findByUser(user).orElse(new ClassicalRating(user, new RatingCalculator())).getRating())
                .ratingRapid(rapidRatingRepository.findByUser(user).orElse(new RapidRating(user, new RatingCalculator())).getRating())
                .ratingBlitz(blitzRatingRepository.findByUser(user).orElse(new BlitzRating(user, new RatingCalculator())).getRating())
                .ratingBullet(bulletRatingRepository.findByUser(user).orElse(new BulletRating(user, new RatingCalculator())).getRating())
                .build();
    }

    public static User toUser(UserResponse userResponse){
        return User
                .builder()
                .id(userResponse.getId())
                .firstname(userResponse.getFirstname())
                .lastName(userResponse.getLastName())
                .nameInGame(userResponse.getNameInGame())
                .country(userResponse.getCountry())
                .build();
    }
}
