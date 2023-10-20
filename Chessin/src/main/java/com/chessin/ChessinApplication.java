package com.chessin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class ChessinApplication extends SpringBootServletInitializer {

    public static void main(String[] args) {
        SpringApplication.run(ChessinApplication.class, args);
    }

}
