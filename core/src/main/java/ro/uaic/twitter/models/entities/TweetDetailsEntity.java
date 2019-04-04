package ro.uaic.twitter.models.entities;

import lombok.Getter;
import lombok.Setter;
import twitter4j.Place;
import twitter4j.User;

@Getter
@Setter
public class TweetDetailsEntity {
    private Place place;
    private User user;
    private long quotedTweetId;
    private Integer retweetsCount;
    private Integer favoriteCount;
    private String tweetText;
    private String[] listOfCountrieWitheld;
}
