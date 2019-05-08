package ro.uaic.twitter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import ro.uaic.twitter.configuration.TwitterConfiguration;

@SpringBootApplication
@EnableMongoRepositories
@EnableConfigurationProperties(TwitterConfiguration.class)
public class TwitterCollectorApplication {
    public static void main(String[] args) {
        SpringApplication.run(TwitterCollectorApplication.class, args);
    }


}
