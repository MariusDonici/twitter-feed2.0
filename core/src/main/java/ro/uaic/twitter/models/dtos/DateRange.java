package ro.uaic.twitter.models.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
public class DateRange {
    public LocalDate start;
    public LocalDate end;
}
