import { Tweet } from './tweet';
import { Coordinates } from './coordinates';
import * as L from 'leaflet';
import { LatLngExpression } from 'leaflet';

export class CustomMarker extends L.Marker {
  coords: Coordinates = new Coordinates();
  tweet: Tweet;

  constructor(tweet: Tweet, latLng: LatLngExpression, options?: L.MarkerOptions) {
    super(latLng, options);
    this.tweet = tweet;
  }
}
