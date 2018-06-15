package ro.uaic.twitter.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import ro.uaic.twitter.models.entities.TweetEntity;

@Repository
public interface TweetRepository extends MongoRepository<TweetEntity, String> {

    Page<TweetEntity> findAll(Pageable pageable);
}

