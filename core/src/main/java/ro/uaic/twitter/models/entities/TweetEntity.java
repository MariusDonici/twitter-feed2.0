package ro.uaic.twitter.models.entities;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import twitter4j.GeoLocation;
import twitter4j.Place;
import twitter4j.User;

import java.util.Date;

@Getter
@Setter
@Document(collection = "tweets")
public class TweetEntity {

    @Id
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
