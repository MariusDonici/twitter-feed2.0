package ro.uaic.twitter.models.dtos;

import lombok.*;
import twitter4j.Place;
import twitter4j.User;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TweetDetails {

    private User user;
    private Place place;
    private long quotedTweetId;
    private Integer retweetsCount;
    private Integer favoriteCount;
    private String tweetText;
    private String[] listOfCountrieWitheld;
}
