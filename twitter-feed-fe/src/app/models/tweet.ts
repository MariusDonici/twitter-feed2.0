import * as L from "leaflet";
export class Tweet {
  id: String;
  user: {
    name: String;
    location: String;
    email: String;
    followersCount: number;
    profileBackgroundImageUrlHttps: String;
    lang: String;
    friendsCount: number;
  };
  geoLocation: {
    latitude: number;
    longitude: number;
  };
  isRetweet: Boolean;
  language: string;
  tweetText: String;
  source: String;
  createdAt: String;
  marker: L.Marker;

  getLatLng(): L.LatLng {
    return L.latLng(this.geoLocation.latitude, this.geoLocation.longitude);
  }
}
