import * as L from "leaflet";
import { TweetDetails } from "./tweet-details";

export class Tweet {
  id: String;
  latitude: number;
  longitude: number;
  createdAt: String;
  details: TweetDetails;
  isRetweet: Boolean;
  language: string;
  source: String;

  getLatLng(): L.LatLng {
    return L.latLng(this.latitude, this.longitude);
  }
}
