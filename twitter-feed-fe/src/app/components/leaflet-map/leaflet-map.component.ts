import { Component, OnInit, ViewChild, NgZone } from "@angular/core";
import { TweetService } from "../../services/tweet.service";
import * as L from "leaflet";
import { Tweet } from "../../models/tweet";
import { MapUtils } from "../../utils/map-utils";
import { LocationService } from "../../services/location.service";
import { CustomMarker } from "../../models/marker";
import * as loda from "lodash";
import { MapService } from "../../services/map.service";

@Component({
  selector: "app-leaflet-map",
  templateUrl: "./leaflet-map.component.html",
  styleUrls: ["./leaflet-map.component.css"]
})
export class LeafletMapComponent implements OnInit {
  map: L.Map = null;

  loading = true;

  options = null;

  centerPosition: L.LatLng;

  markers: L.Marker[] = [];

  tweetList: Tweet[] = [];

  constructor(
    private mapUtils: MapUtils,
    private tweetService: TweetService,
    private locationService: LocationService,
    private mapService: MapService,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.getTweets();

    this.locationService.getLocation().subscribe(coords => {
      this.loading = false;
      this.options = this.mapUtils.getMapOptions(
        L.latLng(coords.latitude, coords.longitude)
      );

      const myMagicMap = L.map("myMap", this.options);
      L.control.layers(this.mapService.baseMaps).addTo(myMagicMap);
      this.mapService.map = myMagicMap;

      this.loading = false;
    });

    this.mapService.map.on("moveend", () => console.log("moved"));
  }

  private getTweets() {
    this.tweetService.retrieveHeroesPageable().subscribe(tweets =>
      tweets.forEach(tweet => {
        if (tweet.geoLocation) {
          this.tweetList.push(tweet);
        }
      })
    );
  }

  // mapIsReady
  private onMapReady(eventMap: L.Map) {
    this.map = eventMap;
    this.mapService.map = eventMap;
    // eventMap.on("moveend", this.handleBoundsChange(this.mapService.map));
  }

  private dataLoaded(): boolean {
    return this.centerPosition !== undefined;
  }

  private getLayerControl() {
    return {
      baseLayers: this.mapService.baseMaps
    };
  }

  private addMarker(e) {
    L.marker(e.latLng).addTo(this.map);
  }

  private handleBoundsChange(eventMap: L.Map) {
    this.tweetList.forEach(tweet => {
      if (tweet.geoLocation) {
        const tweetCoords = L.latLng(
          tweet.geoLocation.latitude,
          tweet.geoLocation.longitude
        );

        const marker = L.marker(
          L.latLng(tweet.geoLocation.latitude, tweet.geoLocation.longitude),
          { icon: this.mapUtils.getIcon() }
        );
        marker.addTo(eventMap);
        this.markers.push(marker);

        // don't add already existing marker
        // if (
        //   this.map.getBounds().contains(tweetCoords) &&
        //   this.markers.find(
        //     existingMarker =>
        //       existingMarker.latLng.lat === marker.latLng.lat &&
        //       existingMarker.latLng.lng === marker.latLng.lng
        //   ) === undefined
        // ) {
        //   this.markers.push(marker);
        // }
      }
    });

    this.markers = this.markers.filter(marker => {
      const coords = L.latLng(marker.getLatLng().lat, marker.getLatLng().lng);

      return eventMap.getBounds().contains(coords);
    });

    console.log(this.markers.length);
  }
}
