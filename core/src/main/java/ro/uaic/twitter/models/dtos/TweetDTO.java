package ro.uaic.twitter.models.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import twitter4j.GeoLocation;
import twitter4j.Place;
import twitter4j.User;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TweetDTO {

    private String id;
    private Date createdAt;
    private User user;
    private GeoLocation geoLocation;
    private String language;
    private Place place;
    private long quotedTweetId;
    private Integer retweetsCount;
    private Integer favoriteCount;
    private String source;
    private String tweetText;
    private String[] listOfCountrieWitheld;
    private Boolean isRetweet;
}

