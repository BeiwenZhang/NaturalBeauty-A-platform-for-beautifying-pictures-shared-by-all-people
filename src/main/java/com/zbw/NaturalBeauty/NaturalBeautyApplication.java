package com.zbw.NaturalBeauty;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan("com")
public class NaturalBeautyApplication {

    public static void main(String[] args) {
        SpringApplication.run(NaturalBeautyApplication.class, args);
    }

}
