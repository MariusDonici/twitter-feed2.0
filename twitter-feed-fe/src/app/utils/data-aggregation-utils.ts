import { CustomMarker } from "../models/marker";
import { countBy } from "lodash";
import { Injectable } from "@angular/core";

@Injectable()
export class DataAggregationUtils {

  //TODO:Find better handling..
  //Return an array of tuples
  retrieveLanguages(markers: CustomMarker[]): any {

    const languageDictionary = countBy(markers, function (e) {
      return e.tweet.language;
    });

    let languageMap = new Map();

    markers.map(e => e.tweet.language).forEach(language => {
      if (languageMap.get(language) === undefined) {
        languageMap.set(language, 1);
      } else {
        languageMap.set(language, languageMap.get(language) + 1);
      }
    });

    return Array.from(languageMap.entries()).sort((a, b) => b[1] - a[1]).map((key, value) => [key, value]);
  }

  retrieveSources(markers: CustomMarker[]): any {

    const languageDictionary = countBy(markers, function (e) {
      return e.tweet.source;
    });

    let languageMap = new Map();

    markers.map(e => e.tweet.source).forEach(language => {
      if (languageMap.get(language) === undefined) {
        languageMap.set(language, 1);
      } else {
        languageMap.set(language, languageMap.get(language) + 1);
      }
    });

    return Array.from(languageMap.entries()).sort((a, b) => b[1] - a[1]).map((key, value) => [key, value]);
  }
}
