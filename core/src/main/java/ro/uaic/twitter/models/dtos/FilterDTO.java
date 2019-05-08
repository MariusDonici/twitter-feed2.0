package ro.uaic.twitter.models.dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class FilterDTO {
    private DateRange range;
    private List<String> filters = new ArrayList<>();
}
