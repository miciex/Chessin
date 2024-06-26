package com.chessin.model.playing;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Disconnection {
    boolean whiteDisconnected;
    boolean blackDisconnected;
    boolean realDisconnection;
    Object ping;
    Object listener;
}
