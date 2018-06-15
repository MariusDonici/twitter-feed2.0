package ro.uaic.twitter.configuration;

import lombok.Getter;
import lombok.Setter;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

@Setter
@Getter
public class TwitterConfiguration {

    private String consumerKey;
    private String consumerSecret;
    private String accessKey;
    private String accessSecret;
    private Boolean debugMode;

    public TwitterConfiguration(String config) {
        try (InputStream inputStream = new FileInputStream(getClass().getClassLoader().getResource("auth.properties").getFile())) {
            Properties properties = new Properties();
            properties.load(inputStream);

            consumerKey = properties.getProperty(String.format("oauth.%s.consumerKey", config));
            consumerSecret = properties.getProperty(String.format("oauth.%s.consumerSecret", config));
            accessKey = properties.getProperty(String.format("oauth.%s.accessToken", config));
            accessSecret = properties.getProperty(String.format("oauth.%s.accessTokenSecret", config));
            debugMode = Boolean.parseBoolean(properties.getProperty(String.format("oauth.%s.debug", config)));

        } catch (IOException exception) {
            exception.printStackTrace();
        }
    }




}
