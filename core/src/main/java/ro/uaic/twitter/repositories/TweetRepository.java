package ro.uaic.twitter.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import ro.uaic.twitter.models.entities.TweetEntity;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TweetRepository extends MongoRepository<TweetEntity, String> {

    Page<TweetEntity> findAll(Pageable pageable);

    @Query(value = "{}", fields = "{tweetDetails:0}")
    List<TweetEntity> findAllTweetOnlyCoordinates();

    @Query("{'createdAt' : {$gte: ?2, $lt: ?3}}")
    List<TweetEntity> findAllBySourceInAndLanguageInAndCreatedAtBetween(List<String> sources, List<String> languages, LocalDate start, LocalDate end);
}

