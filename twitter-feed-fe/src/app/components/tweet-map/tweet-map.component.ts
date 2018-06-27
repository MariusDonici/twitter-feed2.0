import { Component, OnInit, ViewChild } from "@angular/core";
import { TweetService } from "../../services/tweet.service";
import { CustomMarker } from "../../models/marker";
import { Tweet } from "../../models/tweet";
import { LocationService } from "../../services/location.service";
import { AgmMap, LatLng } from "@agm/core";
import * as _ from "lodash";
declare var google: any;

@Component({
  selector: "app-tweet-map",
  templateUrl: "./tweet-map.component.html",
  styleUrls: ["./tweet-map.component.css"]
})
export class TweetMapComponent implements OnInit {
  @ViewChild("AgmMap") agmMap: AgmMap;

  constructor(
    private tweetService: TweetService,
    private locationService: LocationService
  ) {}

  latitude: string | number = 51;
  longitude: string | number = 43;

  tweetList: Tweet[] = [];
  markers: CustomMarker[] = [];

  ngOnInit() {
    // this.getTweets();

    this.locationService.getLocation().subscribe(coords => {
      this.latitude = coords.latitude;
      this.longitude = coords.longitude;
    });


    //MAP options
    if (this.agmMap) {
      this.agmMap.minZoom = 3;
      this.agmMap.maxZoom = 20;
    }
  }

  private getTweets() {
    this.tweetService.retrieveHeroesPageable().subscribe(tweets => tweets.forEach(tweet => {
      if (tweet.geoLocation) {
        // this.markers.push(new CustomMarker(tweet.geoLocation.latitude, tweet.geoLocation.longitude, tweet));
      }
      this.tweetList.push(tweet);
    }));
  }

  // handleBoundsChange(event) {
  //   // add new markers
  //   this.tweetList.forEach(tweet => {
  //     if (tweet.geoLocation) {
  //       const tweetCoords = this.createLatLng(
  //         tweet.geoLocation.latitude,
  //         tweet.geoLocation.longitude
  //       );

  //       const marker = new CustomMarker(
  //         tweet.geoLocation.latitude,
  //         tweet.geoLocation.longitude,
  //         tweet
  //       );

  //       if (
  //         event.contains(tweetCoords) &&
  //         this.markers.find(existingMarker =>
  //           _.isEqual(existingMarker, marker)
  //         ) === undefined
  //       ) {
  //         this.markers.push(marker);
  //       }
  //     }
  //   });

  //   this.markers = this.markers.filter(marker => {
  //     const coords = this.createLatLng(
  //       marker.coords.latitude,
  //       marker.coords.longitude
  //     );

  //     return event.contains(coords);
  //   });
  // }

  // createLatLng(_lat: number, _lng: number): LatLng {
  //   return <LatLng>{
  //     lat: _lat,
  //     lng: _lng
  //   };
  // }
}
