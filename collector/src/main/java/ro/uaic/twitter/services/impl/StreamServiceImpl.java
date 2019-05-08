package ro.uaic.twitter.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.uaic.twitter.configuration.TwitterConfiguration;
import ro.uaic.twitter.repositories.TweetRepository;
import ro.uaic.twitter.services.listeners.impl.ApplicationTweetListener;
import twitter4j.FilterQuery;
import twitter4j.TwitterStream;
import twitter4j.TwitterStreamFactory;
import twitter4j.conf.Configuration;
import twitter4j.conf.ConfigurationBuilder;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class StreamServiceImpl {
    private TweetRepository tweetRepository;
    private TwitterStream appStream;
    private TwitterStream userStream;
    private TwitterConfiguration twitterConfiguration;

    private ApplicationTweetListener applicationTweetListener;

    @Autowired
    public StreamServiceImpl(TweetRepository tweetRepository, TwitterConfiguration twitterConfiguration, ApplicationTweetListener applicationTweetListener) {
        this.tweetRepository = tweetRepository;
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

    //    @PostConstruct
    public void pleaseMigrate() {
        tweetRepository.findAll().forEach(tweet -> {
            tweet.setHashtags(extractHashtags(tweet.getTweetDetails().getTweetText()));
            tweet.getTweetDetails().setTweetText(cleanString(tweet.getTweetDetails().getTweetText()));

            tweetRepository.save(tweet);
        });
    }


    private List<String> extractHashtags(String text) {
        Set<String> hashtags = new HashSet<>();

        Pattern HASHTAG_PATTERN = Pattern.compile("#(\\w+)");
        Matcher mat = HASHTAG_PATTERN.matcher(text);
        while (mat.find()) {
            hashtags.add(mat.group(1));
        }

        return new ArrayList<>(hashtags);
    }

    private String cleanString(String text) {
        text = text.replaceAll("#\\w+", "");
        text = text.replaceAll("((https?|ftp|gopher|telnet|file|Unsure|http):((//)|(\\\\))+[\\w\\d:#@%/;$()~_?+-=\\\\.&]*)", "");

        return text;
    }
}
