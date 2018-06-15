package ro.uaic.twitter.services.listeners.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Component;
import ro.uaic.twitter.models.entities.TweetEntity;
import ro.uaic.twitter.repositories.TweetRepository;
import ro.uaic.twitter.services.listeners.TweetListener;
import ro.uaic.twitter.utils.TweetMapper;
import twitter4j.Status;

@Component
public class ApplicationTweetListener implements TweetListener {

    private TweetRepository tweetRepository;
    private TweetMapper tweetMapper;
    private SimpMessageSendingOperations messagingTemplate;

    @Autowired
    public ApplicationTweetListener(TweetRepository tweetRepository,
                                    TweetMapper tweetMapper,
                                    SimpMessageSendingOperations messagingTemplate) {
        this.tweetRepository = tweetRepository;
        this.tweetMapper = tweetMapper;
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public void onStatus(Status status) {
        TweetEntity tweetEntity = tweetMapper.statusToTweet.apply(status);

        if (tweetEntity.getGeoLocation() != null) {
            messagingTemplate.convertAndSend("/topic/stream", tweetEntity);
            tweetRepository.save(tweetEntity);
        }
    }

}
