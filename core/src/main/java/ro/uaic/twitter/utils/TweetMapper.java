package ro.uaic.twitter.utils;

import ro.uaic.twitter.models.entities.TweetEntity;
import org.springframework.stereotype.Component;
import twitter4j.Status;

import java.util.function.Function;

@Component
public class TweetMapper {

    public Function<Status, TweetEntity> statusToTweet = status -> {
        TweetEntity tweetEntity = new TweetEntity();

        tweetEntity.setCreatedAt(status.getCreatedAt());

        tweetEntity.setGeoLocation(status.getGeoLocation());
        tweetEntity.setId(Long.toString(status.getId()));
        tweetEntity.setLanguage(status.getLang());
        tweetEntity.setUser(status.getUser());
        tweetEntity.setListOfCountrieWitheld(status.getWithheldInCountries());
        tweetEntity.setPlace(status.getPlace());
        tweetEntity.setQuotedTweetId(status.getQuotedStatusId());
        tweetEntity.setIsRetweet(status.isRetweet());
        tweetEntity.setRetweetsCount(status.getRetweetCount());
        tweetEntity.setFavoriteCount(status.getFavoriteCount());
        tweetEntity.setSource(status.getSource());
        tweetEntity.setTweetText(status.getText());

        return tweetEntity;
    };

}

