package com.chessin.model.register.user;

import com.chessin.model.playing.ChessGame;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.awt.*;
import java.sql.Blob;
import java.util.Collection;
import java.util.List;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String firstname;
    private String lastName;
    @Column(nullable = false, unique = true)
    private String email;
    private String nameInGame;
    private String password;
    private String role;
    private boolean isTwoFactorAuthenticationEnabled;
    @Enumerated(EnumType.STRING)
    private Provider provider;
    private int ratingBlitz;
    private int ratingBullet;
    private int ratingRapid;
    private int ratingClassical;
    @ManyToMany
    private List<User> friends;
    @OneToMany
    private List<ChessGame> chessGames;
    private boolean isOnline;
    //pfp
    //osobna tabela z oczekującymi grami

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
