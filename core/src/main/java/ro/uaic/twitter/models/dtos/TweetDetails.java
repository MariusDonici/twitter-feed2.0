package ro.uaic.twitter.models.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import twitter4j.Place;
import twitter4j.User;

import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TweetDetails {

    @JsonFormat(pattern = "yyyy-MM-dd hh:mm")
    private Date createdAt;

    private User user;
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
