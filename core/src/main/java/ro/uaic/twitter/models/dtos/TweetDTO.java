package ro.uaic.twitter.models.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TweetDTO {

    private String id;
    private double latitude;
    private double longitude;

    @JsonFormat(pattern = "yyyy-MM-dd hh:mm")
    private Date createdAt;

    private String language;
    private String source;
    private Boolean isRetweet;


    private TweetDetails details;

}

