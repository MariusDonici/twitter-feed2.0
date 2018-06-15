package ro.uaic.twitter.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.uaic.twitter.configuration.TwitterConfiguration;
import ro.uaic.twitter.services.listeners.impl.ApplicationTweetListener;
import twitter4j.FilterQuery;
import twitter4j.TwitterStream;
import twitter4j.TwitterStreamFactory;
import twitter4j.conf.Configuration;
import twitter4j.conf.ConfigurationBuilder;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

@Service
public class StreamServiceImpl {
    private TwitterStream appStream;
    private TwitterStream userStream;

    private ApplicationTweetListener applicationTweetListener;

    @Autowired
    public StreamServiceImpl(ApplicationTweetListener applicationTweetListener) {
        this.applicationTweetListener = applicationTweetListener;

        appStream = new TwitterStreamFactory(getConfiguration("app")).getInstance();
    }

    @PostConstruct
    private void startMiningForData() {
        appStream.addListener(applicationTweetListener);
        double[][] boundingBox = {{-180, -90}, {180, 90}};
        FilterQuery filterQuery = new FilterQuery();
        filterQuery.locations(boundingBox);

        appStream.filter(filterQuery);
    }

    @PreDestroy
    private void stopStreams() {
        userStream.shutdown();
    }


    private Configuration getConfiguration(String config) {
        TwitterConfiguration configuration = new TwitterConfiguration(config);

        ConfigurationBuilder configurationBuilder = new ConfigurationBuilder();

        configurationBuilder.setOAuthConsumerKey(configuration.getConsumerKey())
                            .setOAuthConsumerSecret(configuration.getConsumerSecret())
                            .setOAuthAccessToken(configuration.getAccessKey())
                            .setOAuthAccessTokenSecret(configuration.getAccessSecret());

        return configurationBuilder.build();
    }

}
