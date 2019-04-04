import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewEncapsulation } from "@angular/core";
import * as L from "leaflet";
import "leaflet.markercluster";
import { MapUtils } from "../../utils/map-utils";
import { LocationService } from "../../services/location.service";
import { MapService } from "../../services/map.service";
import { TweetService } from "../../services/tweet.service";
import { Tweet } from "../../models/tweet";
import { FilterService } from "../../services/filter.service";
import { CustomMarker } from "../../models/marker";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { subGroup } from 'assets/leaflet.featuregroup.subgroup.js';
// import '../../../../bower_components/leaflet-slider/dist/leaflet.SliderControl.min.js';
import 'assets/sliderControl.js';
import '../../../../node_modules/leaflet.markercluster.layersupport/dist/leaflet.markercluster.layersupport.js'
import { DataAggregationUtils } from "../../utils/data-aggregation-utils";
import { GroupService } from "../../services/group.service";
import { CustomLayerGroup } from "../../models/CustomLayerGroup";


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
  options: L.MapOptions;
  markers: CustomMarker[] = [];
  parentMarkersGroup: L.MarkerClusterGroup = new L.MarkerClusterGroup([], null);

  allGroupLayers: CustomLayerGroup[] = [];
  filteredMarkers: CustomMarker[] = [];

  layerControl = L.control.layers(this.mapService.baseMaps, null);

  tweets: Tweet[] = [];
  tweetCount: number = 0;

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
    private filterService: FilterService,
    private cdRef: ChangeDetectorRef,
    private dataAggregationUtils: DataAggregationUtils,
    private groupService: GroupService
  ) {
  }

  menuState: string = 'in';

  toggleMenu() {
    this.menuState = this.menuState === 'out' ? 'in' : 'out';
  }

  ngOnInit() {
    this.locationService.getLocation().subscribe(coords => {
      this.options = this.mapUtils.getMapOptions(L.latLng(coords.latitude, coords.longitude));
    });
    this.getTweets();
  }

  onMapReady(map: L.Map) {
    this.map = map;
    this.map.on('overlayremove', (e) => this.handleLayerChange(e, 'overlayremove'));
    this.map.on('overlayadd', (e) => this.handleLayerChange(e, 'overlayadd'));
  }

  private handleLayerChange(e: any, operation: string): void {
    if (operation === 'overlayremove') {
      e.layer.selected = false;
      let tweetIds = this.filteredMarkers.map(m => m.tweet.id);
      e.layer.getLayers().forEach(marker => {
        if (tweetIds.indexOf(marker.tweet.id) === -1) {
          this.filteredMarkers.push(marker);
        }
      })

    } else {
      e.layer.selected = true;
    }
  }

  private getTweets() {
    this.tweetService.retrieveHeroesPageable().subscribe(tweets => {
      this.markers = this.getMarkersFromTweets(tweets).filter(marker => marker !== undefined);
      this.loading = false;
      this.tweetCount = this.markers.length;
      // this.markerClusterData = this.markers;
      // this.addLayerWithSubgroupMethod();
      this.addLayersWithSupportLayerMethod();
    });

  }

  private addLayersWithSupportLayerMethod() {
    let languages = this.dataAggregationUtils.retrieveLanguages(this.markers);
    let customGroupForLanguages = this.groupService.retrieveLanguageGroups(languages, 4);

    let sources = this.dataAggregationUtils.retrieveSources(this.markers);
    let customGroupsForSources = this.groupService.retrieveSourceGroups(sources, 4);


    this.markers.forEach(marker => {
      marker.addTo(customGroupForLanguages.get(marker.tweet.language) !== undefined ? customGroupForLanguages.get(marker.tweet.language) : customGroupForLanguages.get('other'));
      marker.addTo(customGroupsForSources.get(marker.tweet.source.toString()) !== undefined ? customGroupsForSources.get(marker.tweet.source.toString()) : customGroupsForSources.get('other'));
    });

    //Layer support


    let layerSupportGroup = L.markerClusterGroup.layerSupport({ maxClusterRadius: 75 });


    //Add all the layer group the the support group,map and layerControl
    layerSupportGroup.addTo(this.map);

    Array.from(customGroupForLanguages.entries()).forEach((group) => {
      this.allGroupLayers.push(group[1]);
      layerSupportGroup.checkIn(group[1]);
      group[1].addTo(this.map);
      this.layerControl.addOverlay(group[1], this.getFlagForLanguage(group[0]).toString())
    });

    Array.from(customGroupsForSources.entries()).forEach((group) => {
      this.allGroupLayers.push(group[1]);
      layerSupportGroup.checkIn(group[1]);
      group[1].addTo(this.map);
      this.layerControl.addOverlay(group[1], this.getSourceImageForSourceString(group[0]).toString())
    });

    this.layerControl.addTo(this.map);

    var sliderControl = L.control.sliderControl({
      position: "topright",
      layer: layerSupportGroup,
      range: true,
      showAllOnStart: true
    });

    this.map.addControl(sliderControl);
    this.cdRef.markForCheck();
    sliderControl.startSlider();


    this.markersLoaded = true;
    this.cdRef.markForCheck();
  }

  private getMarkersFromTweets(tweets: any[]): CustomMarker[] {
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


  // ##############################################
  // Popup view
  //
  //
  //
  public getTweetCardHTML(tweet: Tweet): String {


    let user = tweet.details.user;
    let htmlContent = "<figure class=\"tweet-card\">\n" +
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
      + this.getFlagForLanguage(tweet.language) + this.getSourceImageForSourceString(tweet.source) +
      "      </div>\n" +
      "      <p>" + tweet.details.tweetText + "</p>\n" +
      "      <div>" + tweet.createdAt + "</div>" +
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
    let sourceIconClass;

    switch (sourceString.toLowerCase()) {
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

  ngAfterViewInit(): void {
  }


//  OUTDADED implementations

  private addLayerWithSubgroupMethod() {
    let subGroupOne = subGroup(this.parentMarkersGroup);
    let subGroupTwo = subGroup(this.parentMarkersGroup);


    let i = 0;
    this.markers.forEach(marker => {
      i += 1;
      marker.addTo(i % 2 ? subGroupOne : subGroupTwo)
    });


    this.parentMarkersGroup.addTo(this.map);

    this.layerControl.addOverlay(subGroupOne, "Group one");
    this.layerControl.addOverlay(subGroupTwo, "Group two");
    this.layerControl.addTo(this.map);


    subGroupOne.addTo(this.map);
    subGroupTwo.addTo(this.map);

    this.markersLoaded = true;
  }

  markerClusterReady(group: L.MarkerClusterGroup) {
    this.markerClusterGroup = group;
  }


  updateCluster() {
    // console.log("updating cluster");
    // this.markerClusterGroup.clearLayers();
    // this.markerClusterData = [];
    // this.markerClusterGroup.addLayers(this.markers);
  }


  //TODO: Do something like active filter list and remove/add markers in the layer based on that
  hideSomething() {
    let toRemoveLayer = this.allGroupLayers.find((layer) => layer.name == 'en');

    if (toRemoveLayer.isSelected()) {
      let layers = toRemoveLayer.getLayers();

      toRemoveLayer.clearLayers();

      layers.forEach(layer => layer.tweet.source)
    } else {
      this.map.addLayer(toRemoveLayer)
    }
  }
}
