package ro.uaic.twitter.services;

import ro.uaic.twitter.models.dtos.FilterDTO;

import java.util.List;

public interface StatisticsService {

    List<String> getStatistics(FilterDTO filters);
}
