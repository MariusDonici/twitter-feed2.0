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
    private GeoLocation geoLocation;
    private String language;
    private String source;
    private Boolean isRetweet;

    private TweetDetailsEntity tweetDetails;
}
