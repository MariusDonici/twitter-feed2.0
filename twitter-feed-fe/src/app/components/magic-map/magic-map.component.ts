import { Component, OnInit, AfterViewInit, ElementRef } from "@angular/core";
import * as L from "leaflet";
import { MapUtils } from "../../utils/map-utils";
import { LocationService } from "../../services/location.service";
import { MapService } from "../../services/map.service";
import { TweetService } from "../../services/tweet.service";
import { Tweet } from "../../models/tweet";
import { Dictionary } from "lodash";
import * as _ from "lodash";
import { Data } from "../../models/data";
import { FilterService } from "../../services/filter.service";
import { FilterItem } from "../../models/filter-item";

@Component({
  selector: "app-magic-map",
  templateUrl: "./magic-map.component.html",
  styleUrls: ["./magic-map.component.css"]
})
export class MagicMapComponent implements OnInit, AfterViewInit {
  map: L.Map;
  loading = true;
  options: any;
  markers: L.Marker[] = [];

  filteredTweets: Tweet[] = [];
  languageFilters: Data[] = [];
  filterItems: FilterItem = new FilterItem();

  tweets: Tweet[] = [];

  markersLoaded = false;

  // Marker cluster stuff
  markerClusterGroup: L.MarkerClusterGroup;
  markerClusterData: any[] = [];
  markerClusterOptions: L.MarkerClusterGroupOptions = {
    chunkedLoading: true,
    chunkDelay: 150,
    chunkProgress: this.updateProgressBar.bind(this),
    showCoverageOnHover: true,
    zoomToBoundsOnClick: true,
    spiderfyOnMaxZoom: true,
    removeOutsideVisibleBounds: true,
    animate: true
  };

  constructor(
    private mapUtils: MapUtils,
    private mapService: MapService,
    private element: ElementRef,
    private locationService: LocationService,
    private tweetService: TweetService,
    private filterService: FilterService
  ) {}

  ngOnInit() {
    this.locationService.getLocation().subscribe(coords => {
      this.options = this.mapUtils.getMapOptions(
        L.latLng(coords.latitude, coords.longitude)
      );
    });
    this.getTweets();
  }

  onMapReady(map: L.Map) {
    this.map = map;
    L.control.layers(this.mapService.baseMaps).addTo(this.map);
    console.log("init map:" + this.map.getCenter());
    this.refreshLanguages();

    this.map.on("moveend", this.filterTweets.bind(this));
  }

  filterTweets() {
    // this.filterItems.bounds = this.map.getBounds();

    // this.filteredTweets = this.filterService.filterTweet(
    //   this.tweets,
    //   this.filterItems
    // );

    // console.log(this.filteredTweets.length);
    // this.markers = this.getMarkersFromTweets(this.filteredTweets);
    // this.refreshLanguages();
    // this.updateCluster();
  }

  handleLanguageEvent(event) {
    console.log("handle language " + event.source.name);
    if (this.filterItems.languages.includes(event.source.name)) {
      const index = this.filterItems.languages.indexOf(event.source.name, 0);

      this.filterItems.languages.splice(index, 1);
    } else {
      this.filterItems.languages.push(event.source.name);
    }

    this.filterTweets();
  }

  ngAfterViewInit() {}

  private getTweets() {
    this.tweetService.retrieveHeroesPageable().subscribe(tweets => {
      this.markers = this.getMarkersFromTweets(tweets);
      this.loading = false;
      this.markerClusterData = this.markers;
    });
  }

  private getMarkersFromTweets(tweets: any[]): L.Marker[] {
    return tweets.map(tweet => {
      if (tweet.geoLocation) {
        this.tweets.push(tweet);
        this.filteredTweets.push(tweet);
        const marker = L.marker(
          [tweet.geoLocation.latitude, tweet.geoLocation.longitude],
          { icon: this.mapUtils.getIcon() }
        ).bindPopup(tweet.tweetText);
        tweet.marker = marker;
        return marker;
      }
    });
  }

  isDataLoaded() {
    return this.options && this.markers.length > 0;
  }

  markerClusterReady(group: L.MarkerClusterGroup) {
    this.markerClusterGroup = group;
  }

  updateProgressBar(processed, total, elapsed, layersArray) {
    if (elapsed > 1000) {
      // if it takes more than a second to load, display the progress bar:
      this.markersLoaded = false;
    }
    if (processed === total && total !== 0) {
      // all markers processed - hide the progress bar:
      this.markersLoaded = true;
    }
  }

  updateCluster() {
    // console.log("updating cluster");
    // this.markerClusterGroup.clearLayers();
    // this.markerClusterData = [];
    // this.markerClusterGroup.addLayers(this.markers);
  }

  getLanguages(): Dictionary<number> {
    const languageDictionary = _.countBy(this.filteredTweets, function(e) {
      return e.language;
    });

    console.log(languageDictionary);
    return languageDictionary;
  }

  refreshLanguages() {
    // const newLocal = this.filteredTweets.reduce((acc, curr) => {
    //   acc[curr.language] = acc[curr.language] ? acc[curr.language] + 1 : 1;
    //   return acc;
    // }, {});

    // this.languageFilters = Object.keys(newLocal).map(
    //   key => new Data(key, newLocal[key])
    // );
  }
}
