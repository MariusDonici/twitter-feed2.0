import { DateRange } from "./date-range";
import { FilterItem } from "./filter-item";

export class FilterItemDto {

  // filters: FilterItem[] = [];

  filterValues: string[] = [];
  range: DateRange;
}
