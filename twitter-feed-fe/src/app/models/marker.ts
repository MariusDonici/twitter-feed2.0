import { Tweet } from './tweet';
import { Coordinates } from './coordinates';
export class CustomMarker {
  coords: Coordinates = new Coordinates();
  tweet: Tweet;

  constructor(lat: number, lng: number, tweet: Tweet) {
    this.coords.latitude = lat;
    this.coords.longitude = lng;
    this.tweet = tweet;
  }
}
