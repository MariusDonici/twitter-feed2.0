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
    private TwitterConfiguration twitterConfiguration;

    private ApplicationTweetListener applicationTweetListener;

    @Autowired
    public StreamServiceImpl(TwitterConfiguration twitterConfiguration, ApplicationTweetListener applicationTweetListener) {
        this.twitterConfiguration = twitterConfiguration;
        this.applicationTweetListener = applicationTweetListener;

        appStream = new TwitterStreamFactory(getConfiguration()).getInstance();
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


    private Configuration getConfiguration() {

        ConfigurationBuilder configurationBuilder = new ConfigurationBuilder();

        configurationBuilder.setOAuthConsumerKey(twitterConfiguration.getConsumerKey())
                            .setOAuthConsumerSecret(twitterConfiguration.getConsumerSecret())
                            .setOAuthAccessToken(twitterConfiguration.getAccessToken())
                            .setOAuthAccessTokenSecret(twitterConfiguration.getAccessTokenSecret());

        return configurationBuilder.build();
    }

}
