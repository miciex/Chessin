package com.chessin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ChessinApplication {

    //static EmailService emailService = new EmailService();

    public static void main(String[] args) {
        SpringApplication.run(ChessinApplication.class, args);
        //emailService.sendEmail("chessinteam@gmail.com", "test");
    }

}
