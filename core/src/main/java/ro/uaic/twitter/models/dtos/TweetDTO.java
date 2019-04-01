package ro.uaic.twitter.models.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TweetDTO {

    private String id;
    private double latitude;
    private double longitude;
    private TweetDetails details;
}

