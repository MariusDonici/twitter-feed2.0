package ro.uaic.twitter.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import ro.uaic.twitter.models.dtos.TweetDTO;
import ro.uaic.twitter.models.dtos.TweetDetails;
import ro.uaic.twitter.models.entities.TweetEntity;
import ro.uaic.twitter.repositories.TweetRepository;
import ro.uaic.twitter.services.TweetReadService;
import ro.uaic.twitter.utils.TweetMapper;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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


    public List<TweetDTO> retrieveTweetsWithCoordinates() {

        return tweetRepository.findAllTweetOnlyCoordinates()
                              .stream()
                              .map(tweet -> mapToDto(tweet, Boolean.FALSE))
                              .collect(Collectors.toList());
    }

    @Override
    public TweetDTO retrieveTweetById(String id) {
        Optional<TweetEntity> tweetOpt = tweetRepository.findById(id);
        if (tweetOpt.isPresent()) {
            TweetEntity tweet = tweetOpt.get();

            return mapToDto(tweet, Boolean.TRUE);
        } else {
            throw new RuntimeException();
        }
    }

    private TweetDTO mapToDto(TweetEntity tweet, Boolean includeDetails) {
        TweetDTO tweetDTO = TweetDTO.builder()
                                    .id(tweet.getId())
                                    .latitude(tweet.getGeoLocation().getLatitude())
                                    .longitude(tweet.getGeoLocation().getLongitude())
                                    .build();

        if (includeDetails) {
            TweetDetails tweetDetails = TweetDetails.builder()
                                                    .source(tweet.getSource())
                                                    .createdAt(tweet.getCreatedAt())
                                                    .favoriteCount(tweet.getFavoriteCount())
                                                    .retweetsCount(tweet.getRetweetsCount())
                                                    .user(tweet.getUser())
                                                    .place(tweet.getPlace())
                                                    .isRetweet(tweet.getIsRetweet())
                                                    .language(tweet.getLanguage())
                                                    .tweetText(tweet.getTweetText())
                                                    .build();
            tweetDTO.setDetails(tweetDetails);
        }

        return tweetDTO;
    }
}
