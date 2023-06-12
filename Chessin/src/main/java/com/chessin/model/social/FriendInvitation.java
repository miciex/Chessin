package com.chessin.model.social;

import com.chessin.model.register.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.procedure.internal.FunctionReturnImpl;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class FriendInvitation {
    @Id
    private long id;
    @ManyToOne
    private User user;
    @ManyToOne
    private User friend;
    Instant date;
}
