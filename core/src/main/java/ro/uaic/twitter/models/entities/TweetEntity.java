package ro.uaic.twitter.models.entities;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import twitter4j.GeoLocation;
import twitter4j.Place;
import twitter4j.User;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Document(collection = "tweets-revised")
public class TweetEntity {

    @Id
    private String id;
    private Date createdAt;
    private GeoLocation geoLocation;
    private String language;
    private String source;
    private List<String> hashtags = new ArrayList<>();

    //TODO: Use Place.getCountry() instead of language for the flag.
    private TweetDetailsEntity tweetDetails;
}
