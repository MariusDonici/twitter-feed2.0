package ro.uaic.twitter.services.impl;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.GroupOperation;
import org.springframework.data.mongodb.core.aggregation.MatchOperation;
import org.springframework.data.mongodb.core.aggregation.SortOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;
import ro.uaic.twitter.models.dtos.DateRange;
import ro.uaic.twitter.models.dtos.FilterDTO;
import ro.uaic.twitter.models.dtos.StatDTO;
import ro.uaic.twitter.services.StatisticsService;

import javax.annotation.PostConstruct;
import java.sql.Date;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class StatisticsServiceImpl implements StatisticsService {

    private MongoTemplate mongoTemplate;

    public StatisticsServiceImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @PostConstruct
    void execMe() {

        FilterDTO filterDTO = new FilterDTO();
        filterDTO.setRange(new DateRange(LocalDate.of(2019, 5, 1), LocalDate.of(2019, 5, 7)));
        filterDTO.setFilters(Arrays.asList("Instagram"));


        getStatistics(filterDTO);
    }


    //TODO: Should take into consideration the selected filters as well
    @Override
    public List<String> getStatistics(FilterDTO filters) {
        List<StatDTO> sourceStats = getAggregationForField("source", filters);
        List<StatDTO> languageStats = getAggregationForField("language", filters);

        return Collections.emptyList();
    }

    public List<StatDTO> getAggregationForField(String field, FilterDTO filterDTO) {
        Criteria baseMatchCriteria = new Criteria("createdAt").lte(Date.from(filterDTO.getRange().getEnd().atStartOfDay(ZoneId.systemDefault()).toInstant()))
                                                              .andOperator(new Criteria("createdAt").gte(Date.from(filterDTO.getRange().getStart().atStartOfDay(ZoneId.systemDefault()).toInstant())));
        switch (field) {
            case "source":
                baseMatchCriteria = baseMatchCriteria.andOperator(new Criteria("language").in(filterDTO.getFilters()));
                break;
            case "language":
                baseMatchCriteria = baseMatchCriteria.andOperator(new Criteria("source").in(filterDTO.getFilters()));
                break;

            default:
                Criteria sourceCriteria = new Criteria("source").in(filterDTO.getFilters());
                Criteria languageCriteria = new Criteria("language").in(filterDTO.getFilters());
                baseMatchCriteria = sourceCriteria.orOperator(languageCriteria);
        }

        GroupOperation groupBySource = Aggregation.group(field).count().as("value");

        MatchOperation matchStage = Aggregation.match(baseMatchCriteria);
        SortOperation sortDescByValue = Aggregation.sort(new Sort(Sort.Direction.DESC, "value"));


        Aggregation aggregation = Aggregation.newAggregation(matchStage, groupBySource, sortDescByValue);

        return mongoTemplate.aggregate(aggregation, "tweets-revised", StatDTO.class).getMappedResults();
    }
}
