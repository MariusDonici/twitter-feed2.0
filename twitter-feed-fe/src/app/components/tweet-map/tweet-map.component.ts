import {Component, OnInit, ViewChild} from '@angular/core';
import {TweetService} from '../../services/tweet-service.service';
import {CustomMarker} from '../../models/marker';
import {Tweet} from '../../models/tweet';
import {LocationService} from '../../services/location.service';
import {AgmMap, LatLng} from '@agm/core';
import * as _ from 'lodash';
declare var google: any;

@Component({
  selector: 'app-tweet-map',
  templateUrl: './tweet-map.component.html',
  styleUrls: ['./tweet-map.component.css']
})
export class TweetMapComponent implements OnInit {
  @ViewChild('AgmMap') agmMap: AgmMap;

  constructor(private tweetService: TweetService,
              private locationService: LocationService) {
  }

  latitude: string | number = 51;
  longitude: string | number = 43;

  tweetList: Tweet[] = [];
  markers: CustomMarker[] = [];

  ngOnInit() {
    this.tweetService.retrieveHeroesPageable().subscribe(tweets =>
      tweets.forEach(tweet => {
        if (tweet.geoLocation) {
          // this.markers.push(new CustomMarker(tweet.geoLocation.latitude, tweet.geoLocation.longitude, tweet));
        }

        this.tweetList.push(tweet);
      }));

    this.locationService.getLocation().subscribe(coords => {
      this.latitude = coords.latitude;
      this.longitude = coords.longitude;
    });

    this.agmMap.minZoom = 3;
    this.agmMap.maxZoom = 20;

  }

  handleBoundsChange(event) {
    //add new markers
    this.tweetList.forEach(tweet => {

      if (tweet.geoLocation) {
        let tweetCoords = <LatLng>{lat: tweet.geoLocation.latitude, lng: tweet.geoLocation.longitude};
        let marker = new CustomMarker(tweet.geoLocation.latitude, tweet.geoLocation.longitude, tweet);

        if (event.contains(tweetCoords) && this.markers.find((existingMarker) => _.isEqual(existingMarker, marker)) === undefined) {
          this.markers.push(marker);
        }
      }
    });

    this.markers = this.markers.filter(marker => {
      let coords = <LatLng>{lat: marker.coords.latitude, lng: marker.coords.longitude};
      return event.contains(coords);
    });
  }

}
