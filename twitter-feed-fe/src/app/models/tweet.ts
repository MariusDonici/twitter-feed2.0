import * as L from "leaflet";
import { TweetDetails } from "./tweet-details";
export class Tweet {
  id: String;
  latitude: number;
  longitude: number;
  details: TweetDetails;
  marker: L.Marker;


  getLatLng(): L.LatLng {
    return L.latLng(this.latitude, this.longitude);
  }
}
