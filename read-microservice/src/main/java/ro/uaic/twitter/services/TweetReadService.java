package ro.uaic.twitter.services;

import ro.uaic.twitter.models.dtos.FilterDTO;
import ro.uaic.twitter.models.dtos.TweetDTO;
import ro.uaic.twitter.models.entities.TweetEntity;

import java.util.List;

public interface TweetReadService {
    List<TweetEntity> retrieveAllTweets(Long page, Long size);

    List<TweetDTO> retrieveTweetsWithCoordinates();

    List<TweetDTO> retrieveTweetsByIdPaginated(List<String> ids);

    TweetDTO retrieveTweetById(String id);

//    List<TweetDTO> filterTweets(FilterDTO filter);
}
