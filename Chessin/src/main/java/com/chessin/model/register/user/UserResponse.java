package com.chessin.model.register.user;

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
    private String email;
    private String nameInGame;
    private String role;
    private int ratingBlitz;
    private int ratingBullet;
    private int ratingRapid;
    private int ratingClassical;
    private String country;

    public static UserResponse fromUser(User user){
        return UserResponse
                .builder()
                .id(user.getId())
                .firstname(user.getFirstname())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .nameInGame(user.getNameInGame())
                .role(user.getRole())
                .ratingBlitz(user.getRatingBlitz())
                .ratingBullet(user.getRatingBullet())
                .ratingRapid(user.getRatingRapid())
                .ratingClassical(user.getRatingClassical())
                .country(user.getCountry())
                .build();
    }

    public static User toUser(UserResponse userResponse){
        return User
                .builder()
                .id(userResponse.getId())
                .firstname(userResponse.getFirstname())
                .lastName(userResponse.getLastName())
                .email(userResponse.getEmail())
                .nameInGame(userResponse.getNameInGame())
                .role(userResponse.getRole())
                .ratingBlitz(userResponse.getRatingBlitz())
                .ratingBullet(userResponse.getRatingBullet())
                .ratingRapid(userResponse.getRatingRapid())
                .ratingClassical(userResponse.getRatingClassical())
                .country(userResponse.getCountry())
                .build();
    }

}
