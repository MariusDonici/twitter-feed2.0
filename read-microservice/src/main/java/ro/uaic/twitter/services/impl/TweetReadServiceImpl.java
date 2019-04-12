package ro.uaic.twitter.services.impl;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import ro.uaic.twitter.models.dtos.TweetDTO;
import ro.uaic.twitter.models.dtos.TweetDetails;
import ro.uaic.twitter.models.entities.TweetEntity;
import ro.uaic.twitter.repositories.TweetRepository;
import ro.uaic.twitter.services.TweetReadService;
import ro.uaic.twitter.utils.TweetMapper;

import java.util.ArrayList;
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

    @Override
    public List<TweetDTO> retrieveTweetsByIdPaginated(List<String> ids) {
        Iterable<TweetEntity> allById = tweetRepository.findAllById(ids);

        List<TweetEntity> tweets = new ArrayList<>();
        CollectionUtils.addAll(tweets, allById.iterator());

        return tweets.stream().map(tweet -> mapToDto(tweet, true)).collect(Collectors.toList());
    }

    private TweetDTO mapToDto(TweetEntity tweet, Boolean includeDetails) {
        TweetDTO tweetDTO = TweetDTO.builder()
                                    .id(tweet.getId())
                                    .latitude(tweet.getGeoLocation().getLatitude())
                                    .longitude(tweet.getGeoLocation().getLongitude())
                                    .createdAt(tweet.getCreatedAt())
                                    .source(tweet.getSource())
                                    .language(tweet.getLanguage())
                                    .isRetweet(tweet.getIsRetweet())
                                    .build();

        if (includeDetails) {
            TweetDetails tweetDetails = TweetDetails.builder()
                                                    .favoriteCount(tweet.getTweetDetails().getFavoriteCount())
                                                    .retweetsCount(tweet.getTweetDetails().getRetweetsCount())
                                                    .user(tweet.getTweetDetails().getUser())
                                                    .place(tweet.getTweetDetails().getPlace())
                                                    .tweetText(tweet.getTweetDetails().getTweetText())
                                                    .build();
            tweetDTO.setDetails(tweetDetails);
        }

        return tweetDTO;
    }
}
