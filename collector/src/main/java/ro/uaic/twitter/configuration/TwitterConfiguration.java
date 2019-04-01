package ro.uaic.twitter.configuration;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource("classpath:auth.properties")
@ConfigurationProperties(prefix = "oauth.app")
@Getter
@Setter
public class TwitterConfiguration {

    private String consumerKey;
    private String consumerSecret;
    private String accessToken;
    private String accessTokenSecret;
    private Boolean debugMode;
}
