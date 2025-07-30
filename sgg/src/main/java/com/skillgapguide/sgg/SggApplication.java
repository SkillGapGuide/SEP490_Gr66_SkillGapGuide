package com.skillgapguide.sgg;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SggApplication {

	public static void main(String[] args) {
		SpringApplication.run(SggApplication.class, args);
	}

}
