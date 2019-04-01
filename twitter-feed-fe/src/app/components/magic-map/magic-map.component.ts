import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewEncapsulation } from "@angular/core";
import * as L from "leaflet";
import { MarkerClusterGroupOptions } from "leaflet";
import "leaflet.markercluster";
import { MapUtils } from "../../utils/map-utils";
import { LocationService } from "../../services/location.service";
import { MapService } from "../../services/map.service";
import { TweetService } from "../../services/tweet.service";
import { Tweet } from "../../models/tweet";
import * as _ from "lodash";
import { Dictionary } from "lodash";
import { Data } from "../../models/data";
import { FilterService } from "../../services/filter.service";
import { FilterItem } from "../../models/filter-item";
import { CustomMarker } from "../../models/marker";
import { animate, state, style, transition, trigger } from "@angular/animations";

@Component({
  selector: "app-magic-map",
  templateUrl: "./magic-map.component.html",

  styleUrls: ["./magic-map.component.css", "./tweet-card.css"],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
  ]
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
  markerClusterOptions: MarkerClusterGroupOptions = {
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
    private filterService: FilterService,
    private cdRef: ChangeDetectorRef
  ) {
  }

  menuState: string = 'in';

  toggleMenu() {
    this.menuState = this.menuState === 'out' ? 'in' : 'out';
  }

  ngAfterViewChecked() {
    let show = this.markersLoaded;
    if (show != this.markersLoaded) { // check if it change, tell CD update view
      this.markersLoaded = show;
      this.cdRef.detectChanges();
    }
  }

  ngOnInit() {
    this.locationService.getLocation().subscribe(coords => {
      this.options = this.mapUtils.getMapOptions(L.latLng(coords.latitude, coords.longitude));
    });
    this.getTweets();
  }

  onMapReady(map: L.Map) {
    this.map = map;
    L.control.layers(this.mapService.baseMaps).addTo(this.map);

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

  ngAfterViewInit() {
  }

  private getTweets() {
    this.tweetService.retrieveHeroesPageable().subscribe(tweets => {
      this.markers = this.getMarkersFromTweets(tweets).filter(marker => marker !== undefined);
      this.loading = false;
      this.markerClusterData = this.markers;
    });
  }

  private getMarkersFromTweets(tweets: any[]): L.Marker[] {
    return tweets.map(tweet => {
      if (tweet.latitude && tweet.longitude) {
        this.tweets.push(tweet);
        // this.filteredTweets.push(tweet);
        const marker = new CustomMarker(tweet,
          [tweet.latitude, tweet.longitude],
          { icon: this.mapUtils.getIcon() }
        );

        marker.on('click', function (e) {
          this.tweetService.getTweetById(marker.tweet.id).subscribe(retrievedTweet => {
            L.popup().setLatLng(e.target._latlng).setContent(this.getTweetCardHTML(retrievedTweet)).openOn(e.target._map);
          });
        }.bind(this));

        if (marker === undefined) {
          console.log("ewtsdfasdf");
        }
        return marker;
      }
    });
  }


  isDataLoaded() {
    return this.options;
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
    const languageDictionary = _.countBy(this.filteredTweets, function (e) {
      return e.details.language;
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

  public getTweetCardHTML(tweet: Tweet): String {


    let user = tweet.details.user;
    let htmlContent = "<figure class=\"snip1559\">\n" +
      "    <div class=\"profile-wrapper\">\n" +
      "      <div class=\"followers-wrapper\">\n" +
      "        <div class=\"followers\">\n" +
      "          <i class=\"ion-person\">" + user.friendsCount + "</i>\n" +
      "        </div>\n" +
      "        <br>\n" +
      "        <div class=\"followers\">\n" +
      "          <i class=\"ion-person-stalker\">" + user.followersCount + "</i>\n" +
      "        </div>\n" +
      "      </div>\n";


    //Add profile picture
    htmlContent += "<div class=\"profile-image\"><img src=\"" + user.biggerProfileImageURL + "\" alt=\"profile-sample2\"";

    if (user.verified) {
      htmlContent += " style=\"border:5px solid deepskyblue;\"";
    }

    htmlContent += "></div>" +
      "        <div class=\"tweet-count\"><i class=\"ion-social-twitter\">" + user.statusesCount + "</i></div>\n" +
      "    </div>\n" +
      "    <figcaption>\n" +
      "      <h3>" + user.name + "</h3>\n" +
      "      <h5>" + user.screenName + "</h5>\n" +
      "      <div class=\"icons\">"
      + this.getFlagForLanguage(tweet.details.language) + this.getSourceImageForSourceString(tweet.details.source) +
      "      </div>\n" +
      "      <p>" + tweet.details.tweetText + "</p>\n" +
      "      <div>" + tweet.details.createdAt + "</div>" +
      "    </figcaption>\n" +
      "  </figure>"
    return htmlContent;
  }

  public getFlagForLanguage(userPrefferedLanguage: String): String {
    let countryForLanguage: String = 'us';

    switch (userPrefferedLanguage.toLowerCase()) {
      case "en":
        countryForLanguage = 'us';
        break;
      case "en-gb":
        countryForLanguage = 'gb';
        break;
      case "ja":
        countryForLanguage = 'jp';
        break;
      case "zh-tw":
        countryForLanguage = 'tw';
        break;
      case "ko":
        countryForLanguage = 'kr';
        break;
      case "cs":
        countryForLanguage = 'cz';
        break;

      case "und":
        countryForLanguage = 'us';
        break;
      default:
        countryForLanguage = userPrefferedLanguage;
    }

    return "<img src=\"https://www.countryflags.io/" + countryForLanguage + "/shiny/32.png\" style='margin-bottom:-5px;'>";
  }

  public getSourceImageForSourceString(sourceString: String): String {
    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = sourceString.toString();

    let source = tempDiv.textContent || tempDiv.innerText || "";
    let sourceIconClass;

    switch (source.toLowerCase()) {
      case "instagram":
        sourceIconClass = 'ion-social-instagram';
        break;
      case "foursquare":
        sourceIconClass = 'ion-social-foursquare';
        break;
      case"foursquare swarm":
        sourceIconClass = 'ion-social-foursquare';
        break;
      case "twitter for android":
        sourceIconClass = 'ion-social-android-outline';
        break;
      case "twitter for iphone":
        sourceIconClass = 'ion-social-apple-outline';
        break;

      case "twitter for ios":
        sourceIconClass = 'ion-social-apple-outline';
        break;
      default:
        sourceIconClass = 'ion-android-globe'
    }


    return "<span><i class=\"" + sourceIconClass + "\" style='font-size:29px'></i></span>\n"
  }
}
