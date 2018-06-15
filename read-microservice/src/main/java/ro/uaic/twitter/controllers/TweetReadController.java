package ro.uaic.twitter.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import ro.uaic.twitter.models.entities.TweetEntity;
import ro.uaic.twitter.services.TweetReadService;

import javax.websocket.server.PathParam;
import java.util.List;

@RestController
@CrossOrigin("*")
public class TweetReadController {

    private TweetReadService tweetReadService;

    @Autowired
    public TweetReadController(TweetReadService tweetReadService) {
        this.tweetReadService = tweetReadService;
    }

    @GetMapping("/retrieve")

    public List<TweetEntity> retrieveTweets(@PathParam("page") Long page, @PathParam("size") Long size) {
        return tweetReadService.retrieveAllTweets(page, size);
    }
}
