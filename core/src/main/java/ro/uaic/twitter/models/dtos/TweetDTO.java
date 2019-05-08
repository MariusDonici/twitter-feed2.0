package ro.uaic.twitter.models.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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
    private List<String> hashtags = new ArrayList<>();


    private TweetDetails details;

}

