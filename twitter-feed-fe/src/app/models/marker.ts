import { Tweet } from './tweet';
import { Coordinates } from './coordinates';
import * as L from 'leaflet';
import { LatLngExpression } from 'leaflet';
import { FilterDTO } from "./filder-dto";

export class CustomMarker extends L.Marker {
  coords: Coordinates = new Coordinates();
  tweet: Tweet;
  applicableFilter: any = {};

  constructor(tweet: Tweet, latLng: LatLngExpression, options?: L.MarkerOptions) {
    super(latLng, options);
    this.tweet = tweet;
    // this.applicableFilter.push(new FilterDTO(tweet.language,0,"LANGUAGE"));
    // this.applicableFilter.push(new FilterDTO(tweet.source.toString(),0,"SOURCE"));

    this.applicableFilter['LANGUAGE'] = tweet.language;
    this.applicableFilter['SOURCE'] = tweet.source;
  }

  getMarkerFilters(): string[]{
    return [this.applicableFilter['LANGUAGE'],this.applicableFilter['SOURCE']];
  }
}
