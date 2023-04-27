package com.chessin.api;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Test {
    @PostMapping("/test")
    public String test(){
        return "test";
    }
}
