import { Injectable } from "@angular/core";
import { FilterItem } from "../models/filter-item";
import { Tweet } from "../models/tweet";
import { filter } from "rxjs/operators";
import * as L from "leaflet";

@Injectable({
  providedIn: "root"
})
export class FilterService {
  constructor() { }

  // filterTweet(tweets: Tweet[], filters: FilterItem): Tweet[] {
  //   return tweets.filter(tweet => {
  //     let fitsInBounds = false;
  //     let fitsInLanguages = false;

  //     if (filters.bounds) {
  //       fitsInBounds = filters.bounds.contains(new L.LatLng(tweet.geoLocation.latitude, tweet.geoLocation.longitude));
  //     }
  //     if (filters.languages) {
  //       fitsInLanguages = filters.languages.length === 0 ? true : filters.languages.includes(tweet.language);
  //     }

  //     return fitsInBounds && fitsInLanguages;
  //   });
  // }
}
