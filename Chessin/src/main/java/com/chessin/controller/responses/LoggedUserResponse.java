package com.chessin.controller.responses;

import com.chessin.model.register.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class LoggedUserResponse {

    private Long id;
    private String firstname;
    private String lastName;
    private String nameInGame;
    private int ratingBlitz;
    private int ratingBullet;
    private int ratingRapid;
    private int ratingClassical;
    private String country;
    private String email;

    public static LoggedUserResponse fromUser(User user) {
        return LoggedUserResponse
                .builder()
                .id(user.getId())
                .firstname(user.getFirstname())
                .lastName(user.getLastName())
                .nameInGame(user.getNameInGame())
//                .ratingBlitz(user.getRatingBlitz())
//                .ratingBullet(user.getRatingBullet())
//                .ratingRapid(user.getRatingRapid())
//                .ratingClassical(user.getRatingClassical())
                .country(user.getCountry())
                .email(user.getEmail())
                .build();
    }

    public static User toUser(LoggedUserResponse userResponse) {
        return User
                .builder()
                .id(userResponse.getId())
                .firstname(userResponse.getFirstname())
                .lastName(userResponse.getLastName())
                .nameInGame(userResponse.getNameInGame())
//                .ratingBlitz(userResponse.getRatingBlitz())
//                .ratingBullet(userResponse.getRatingBullet())
//                .ratingRapid(userResponse.getRatingRapid())
//                .ratingClassical(userResponse.getRatingClassical())
                .country(userResponse.getCountry())
                .email(userResponse.getEmail())
                .build();
    }
}

