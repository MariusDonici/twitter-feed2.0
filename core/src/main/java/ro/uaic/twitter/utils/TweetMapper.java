package ro.uaic.twitter.utils;

import org.springframework.stereotype.Component;
import ro.uaic.twitter.models.entities.TweetDetailsEntity;
import ro.uaic.twitter.models.entities.TweetEntity;
import twitter4j.HashtagEntity;
import twitter4j.Status;

import java.util.*;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
public class TweetMapper {

    public Function<Status, TweetEntity> statusToTweet = status -> {
        TweetEntity tweet = new TweetEntity();
        TweetDetailsEntity tweetDetails = new TweetDetailsEntity();
        tweet.setCreatedAt(status.getCreatedAt());

        tweet.setGeoLocation(status.getGeoLocation());
        tweet.setId(Long.toString(status.getId()));
        tweet.setLanguage(status.getLang());
        tweet.setSource(aggregateSimilarSources(status.getSource()));
        tweet.setHashtags(Arrays.stream(status.getHashtagEntities()).map(HashtagEntity::getText).collect(Collectors.toList()));

        tweetDetails.setUser(status.getUser());
        tweetDetails.setListOfCountrieWitheld(status.getWithheldInCountries());
        tweetDetails.setPlace(status.getPlace());
        tweetDetails.setQuotedTweetId(status.getQuotedStatusId());
        tweetDetails.setRetweetsCount(status.getRetweetCount());
        tweetDetails.setFavoriteCount(status.getFavoriteCount());
        tweetDetails.setTweetText(status.getText());

        tweet.setTweetDetails(tweetDetails);

        return tweet;
    };


    private String aggregateSimilarSources(String tweetSource) {
        //Strip html tags
        String sourceString = tweetSource.replaceAll("<.*?>", "");


        String aggregatedString = sourceString;
        if (sourceString.toLowerCase().contains("ttn")) {
            aggregatedString = "TTN Traffic";
        }

        if (Stream.of("ios", "iphone").anyMatch(sourceString.toLowerCase()::contains)) {
            aggregatedString = "iPhone";
        }

        if (Stream.of("android").anyMatch(sourceString.toLowerCase()::contains)) {
            aggregatedString = "Android";
        }

        if (Stream.of("foursquare").anyMatch(sourceString.toLowerCase()::contains)) {
            aggregatedString = "Foursquare";
        }

        return aggregatedString;
    }
}

