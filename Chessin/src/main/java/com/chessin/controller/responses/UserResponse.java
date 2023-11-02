package com.chessin.controller.responses;

import com.chessin.controller.register.UserService;
import com.chessin.model.playing.GameType;
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
    private String email;

    public static UserResponse fromUser(User user, UserService userService, boolean returnEmail){
        return UserResponse.builder()
                .id(user.getId())
                .firstname(user.getFirstname())
                .lastName(user.getLastName())
                .nameInGame(user.getNameInGame())
                .country(user.getCountry())
                .ratingClassical(userService.getRating(user, GameType.CLASSICAL))
                .ratingRapid(userService.getRating(user, GameType.RAPID))
                .ratingBlitz(userService.getRating(user, GameType.BLITZ))
                .ratingBullet(userService.getRating(user, GameType.BULLET))
                .email(returnEmail ? user.getEmail() : null)
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
