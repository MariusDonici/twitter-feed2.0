package ro.uaic.twitter.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ro.uaic.twitter.models.dtos.TweetDTO;
import ro.uaic.twitter.services.TweetReadService;

import java.util.List;

@RestController
@RequestMapping("/tweets")
@CrossOrigin("*")
public class TweetReadController {

    private TweetReadService tweetReadService;

    @Autowired
    public TweetReadController(TweetReadService tweetReadService) {
        this.tweetReadService = tweetReadService;
    }
//
//    @GetMapping("/retrieve")
//    public List<TweetEntity> retrieveTweets(@PathParam("page") Long page, @PathParam("size") Long size) {
//        return tweetReadService.retrieveAllTweets(page, size);
//    }

    @GetMapping
    public List<TweetDTO> retrieveTweets() {
        return tweetReadService.retrieveTweetsWithCoordinates();
    }

    @GetMapping("/{tweetId}")
    public TweetDTO retrieveTweetById(@PathVariable("tweetId") String tweetId){
        return tweetReadService.retrieveTweetById(tweetId);
    }
}
