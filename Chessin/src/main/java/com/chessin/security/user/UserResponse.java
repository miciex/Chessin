package com.chessin.security.user;

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
    private String password;
    private String role;

    public static UserResponse fromUser(User user){
        return UserResponse
                .builder()
                .id(user.getId())
                .firstname(user.getFirstname())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .nameInGame(user.getNameInGame())
                .password(user.getPassword())
                .role(user.getRole())
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
                .password(userResponse.getPassword())
                .role(userResponse.getRole())
                .build();
    }

}
