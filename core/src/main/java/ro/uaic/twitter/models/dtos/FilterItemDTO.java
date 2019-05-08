package ro.uaic.twitter.models.dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class FilterItemDTO {
    private String type;
    private List<String> values = new ArrayList<>();
}
