package com.chessin;

import com.chessin.security.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.ArrayList;

@SpringBootApplication
public class ChessinApplication {

    //static EmailService emailService = new EmailService();

    public static void main(String[] args) {
        SpringApplication.run(ChessinApplication.class, args);
        //emailService.sendEmail("chessinteam@gmail.com", "test");
    }

}
