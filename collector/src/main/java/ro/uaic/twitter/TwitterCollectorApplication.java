package ro.uaic.twitter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories
public class TwitterCollectorApplication {
    public static void main(String[] args) {
        SpringApplication.run(TwitterCollectorApplication.class, args);
    }
}
