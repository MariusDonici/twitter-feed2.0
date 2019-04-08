import {Injectable} from "@angular/core";

@Injectable()
export class DataAggregationUtils {

  /*
    @fieldListValues - a list of values from the tweet. Ex. source/language/isRetweet etc.

    Return a sorted list of 'tuples'. EG. A[0] = 'EN' A[1] = 1000 where first element is the field value and second is the count number
   */

  //TODO: Find how to make pairs or tuples in typescript
  retrieveTweetFieldMap(fieldListValues: any[]) {

    let fieldMap = new Map();

    fieldListValues.forEach(fieldValue => {
      if (fieldMap.get(fieldValue) === undefined) {
        fieldMap.set(fieldValue, 1);
      } else {
        fieldMap.set(fieldValue, fieldMap.get(fieldValue) + 1);
      }
    });


    return Array.from(fieldMap.entries()).sort((a, b) => b[1] - a[1]).map((key, value) => [key, value]);
  }


}
