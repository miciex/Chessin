package com.chessin.controller.register;

import com.chessin.controller.responses.UserResponse;
import com.chessin.model.playing.GameType;
import com.chessin.model.playing.Glicko2.Entities.BlitzRating;
import com.chessin.model.playing.Glicko2.Entities.BulletRating;
import com.chessin.model.playing.Glicko2.Entities.ClassicalRating;
import com.chessin.model.playing.Glicko2.Entities.RapidRating;
import com.chessin.model.playing.Glicko2.Repositories.BlitzRatingRepository;
import com.chessin.model.playing.Glicko2.Repositories.BulletRatingRepository;
import com.chessin.model.playing.Glicko2.Repositories.ClassicalRatingRepository;
import com.chessin.model.playing.Glicko2.Repositories.RapidRatingRepository;
import com.chessin.model.register.user.Provider;
import com.chessin.model.register.user.User;
import com.chessin.model.register.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final ClassicalRatingRepository classicalRatingRepository;
    private final RapidRatingRepository rapidRatingRepository;
    private final BlitzRatingRepository blitzRatingRepository;
    private final BulletRatingRepository bulletRatingRepository;

    public void processOAuthPostLogin(String email) {
        User user = userRepository.findByEmail(email).get();

        if (user == null) {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setProvider(Provider.GOOGLE);
            userRepository.save(newUser);
        }
    }

    public User setActive(String nickname, boolean active) {
        User user = userRepository.findByNameInGame(nickname).orElse(null);
        if(user != null){
            user.setOnline(active);
            userRepository.save(user);
        }
        return user;
    }

    public List<UserResponse> getFriends(int page, int size, List<UserResponse> friends)
    {
        Pageable pageable = PageRequest.of(page, size);

        int start = (int)pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), friends.size());

        return friends.subList(start, end);
    }

    public double getRating(User user, GameType type){
        return switch (type) {
            case CLASSICAL -> classicalRatingRepository.findByUser(user).orElse(new ClassicalRating()).getRating();
            case RAPID -> rapidRatingRepository.findByUser(user).orElse(new RapidRating()).getRating();
            case BLITZ -> blitzRatingRepository.findByUser(user).orElse(new BlitzRating()).getRating();
            case BULLET -> bulletRatingRepository.findByUser(user).orElse(new BulletRating()).getRating();
        };
    }
}
