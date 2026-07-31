package com.mru.registration;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// This is the single starting point of the whole application.
// Run this file (or `mvn spring-boot:run`) to start the server.
@SpringBootApplication
public class RegistrationApplication {
    public static void main(String[] args) {
        SpringApplication.run(RegistrationApplication.class, args);
    }
}
