package ro.uaic.twitter.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import ro.uaic.twitter.models.entities.TweetEntity;
import ro.uaic.twitter.repositories.TweetRepository;
import ro.uaic.twitter.services.TweetReadService;
import ro.uaic.twitter.utils.TweetMapper;

import java.util.List;

@Service
public class TweetReadServiceImpl implements TweetReadService {

    private TweetRepository tweetRepository;
    private TweetMapper tweetMapper;

    @Autowired
    public TweetReadServiceImpl(TweetRepository tweetRepository, TweetMapper tweetMapper) {
        this.tweetRepository = tweetRepository;
        this.tweetMapper = tweetMapper;
    }

    @Override
    public List<TweetEntity> retrieveAllTweets(Long page, Long size) {

        PageRequest pageRequest = PageRequest.of(page.intValue(), size.intValue());
        System.out.println("called");
        return tweetRepository.findAll(pageRequest).getContent();
    }
}
