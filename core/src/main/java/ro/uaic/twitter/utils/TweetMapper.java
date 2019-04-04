package ro.uaic.twitter.utils;

import ro.uaic.twitter.models.entities.TweetDetailsEntity;
import ro.uaic.twitter.models.entities.TweetEntity;
import org.springframework.stereotype.Component;
import twitter4j.Status;

import java.util.function.Function;

@Component
public class TweetMapper {

    public Function<Status, TweetEntity> statusToTweet = status -> {
        TweetEntity tweet = new TweetEntity();
        TweetDetailsEntity tweetDetails = new TweetDetailsEntity();
        tweet.setCreatedAt(status.getCreatedAt());

        tweet.setGeoLocation(status.getGeoLocation());
        tweet.setId(Long.toString(status.getId()));
        tweet.setLanguage(status.getLang());
        tweet.setIsRetweet(status.isRetweet());
        tweet.setSource(status.getSource().replaceAll("<.*?>",""));

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

}

