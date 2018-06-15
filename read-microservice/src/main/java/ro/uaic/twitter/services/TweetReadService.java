package ro.uaic.twitter.services;

import ro.uaic.twitter.models.entities.TweetEntity;

import java.util.List;

public interface TweetReadService {
    List<TweetEntity> retrieveAllTweets(Long page, Long size);
}
