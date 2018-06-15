package ro.uaic.twitter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories
@ComponentScan({"ro.uaic.twitter"})
public class TwitterReadApplication {
    public static void main(String[] args) {
        SpringApplication.run(TwitterReadApplication.class, args);
    }
}
