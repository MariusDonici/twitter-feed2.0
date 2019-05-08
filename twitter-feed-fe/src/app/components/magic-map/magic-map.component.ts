import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewEncapsulation } from "@angular/core";
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
import '../../../../node_modules/leaflet.markercluster.layersupport/dist/leaflet.markercluster.layersupport.js'
import { DataAggregationUtils } from "../../utils/data-aggregation-utils";
import { GroupService } from "../../services/group.service";
import { CustomLayerGroup } from "../../models/CustomLayerGroup";
import { FilterDTO } from "../../models/filder-dto";
import { RandomUtils } from "../../utils/random-utils";
import { GroupFiltersWrapper } from "../../models/wrappers/group-filters-wrapper";
import { ChangeContext, CustomStepDefinition, Options } from "ng5-slider";
import * as _ from 'lodash';
import { DatePipe } from "@angular/common";
import { FilterItemDto } from "../../models/filter-item-dto";

@Component({
  selector: "app-magic-map",
  templateUrl: "./magic-map.component.html",

  styleUrls: ["./magic-map.component.css", "./tweet-pop-up.css", "./dropdown-style.css", "./tweet-card.css"],
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
export class MagicMapComponent implements OnInit {

  // ###################### SLIDER VARIABLES #####################################
  value: number = 0;
  currentSliderFloor: number = 0;
  currentSliderCeil: number = 0;
  highValue: number = 100;
  sliderOptions: Options = {};

  // ###################### MAP VARIABLES #####################################
  map: L.Map;
  options: L.MapOptions;
  markers: CustomMarker[] = [];
  parentMarkersGroup: L.MarkerClusterGroup = new L.MarkerClusterGroup([], null);
  layerControl = L.control.layers(this.mapService.baseMaps, null);

  layerSupportGroup: any;


  // ###################### FILTERING VARIABLES #####################################
  allGroupLayers: CustomLayerGroup[] = [];
  languagesFromGroups: FilterDTO[] = [];
  sourcesFromGroups: FilterDTO[] = [];

  filters: string[] = ['LANGUAGE', 'SOURCE'];
  selectedFilter: any = {};

  groupFilterWrappers: GroupFiltersWrapper[] = [];

  languagesSettings = this.getDropdownSettings([]);
  sourcesSettings = this.getDropdownSettings([]);

  // ###################### MISC VARIABLES #####################################
  markersLoaded = false;
  tweetCount: number = 0;
  loading = true;


  // ###################### MESSAGE AREA VARIABLES #####################################
  tweetsInMessageArea: Tweet[] = [];
  tweetsWithinBounds: number[] = [];

  // MENU STATES
  filterMenuState: string = 'out';
  messageMenuState: string = 'out';

  constructor(
    private mapUtils: MapUtils,
    private mapService: MapService,
    private element: ElementRef,
    private locationService: LocationService,
    private tweetService: TweetService,
    private filterService: FilterService,
    private cdRef: ChangeDetectorRef,
    private dataAggregationUtils: DataAggregationUtils,
    private groupService: GroupService,
    private datePipe: DatePipe,
    public randomUtils: RandomUtils
  ) {
  }

  ngOnInit() {
    this.filters.forEach(f => this.selectedFilter[f] = []);

    this.locationService.getLocation().subscribe(coords => {
      this.options = this.mapUtils.getMapOptions(L.latLng(coords.latitude, coords.longitude));
    });
    this.getTweets();
  }

  onMapReady(map: L.Map) {
    this.map = map;
  }

  private getTweets() {
    this.tweetService.retrieveTweets().subscribe(tweets => {
      this.markers = this.getMarkersFromTweets(tweets).filter(marker => marker !== undefined);
      this.loading = false;
      this.tweetCount = this.markers.length;

      this.addLayersWithSupportLayerMethod();
    });

  }

  private addLayersWithSupportLayerMethod() {

    //Init filters
    let languages = this.dataAggregationUtils.retrieveTweetFieldMap(this.markers.map(m => m.tweet.language));
    let customGroupForLanguages = this.groupService.retrieveGroupsForFilter(languages, "LANGUAGE", 30);
    this.groupFilterWrappers.push(new GroupFiltersWrapper("LANGUAGE", Array.from(customGroupForLanguages.values())));

    let sources = this.dataAggregationUtils.retrieveTweetFieldMap(this.markers.map(m => m.tweet.source));
    let customGroupsForSources = this.groupService.retrieveGroupsForFilter(sources, "SOURCE", 30);
    this.groupFilterWrappers.push(new GroupFiltersWrapper("SOURCE", Array.from(customGroupsForSources.values())));


    this.markers.forEach(marker => {
      marker.addTo(customGroupForLanguages.get(marker.tweet.language) !== undefined ? customGroupForLanguages.get(marker.tweet.language) : customGroupForLanguages.get('other'));
      marker.addTo(customGroupsForSources.get(marker.tweet.source.toString()) !== undefined ? customGroupsForSources.get(marker.tweet.source.toString()) : customGroupsForSources.get('other'));
    });

    //Layer support


    this.layerSupportGroup = L.markerClusterGroup.layerSupport({
      removeOutsideVisibleBounds: true,
      chunkedLoading: true,
      chunkProgress: (processed, total, elapsed, layersArray) => {
        if (elapsed > 0) {
          // if it takes more than a second to load, display the progress bar:
          this.markersLoaded = false;
        }
        if (processed === total) {
          // all markers processed - hide the progress bar:
          this.markersLoaded = true;
        }
      }
    });


    //Add all the layer group the the support group,map and layerControl
    this.layerSupportGroup.addTo(this.map);


    //Add groups to the group layers and create filter
    Array.from(customGroupForLanguages.entries()).forEach((group, index) => {
      group[1].initializeAllMarkers();
      this.allGroupLayers.push(group[1]);
      this.layerSupportGroup.checkIn(group[1]);


      //Create specific filter for group
      let filter = new FilterDTO(group[0], group[1].getCurrentMarkers().length, group[1].type);
      // if (index === 0) {
        group[1].addTo(this.map);
        group[1].selected = true;
        this.selectedFilter['LANGUAGE'].push(filter);
      // }
      // this.layerControl.addOverlay(group[1], this.getFlagLinkForLanguage(group[0]).toString())
      this.languagesFromGroups.push(filter);
    });

    Array.from(customGroupsForSources.entries()).forEach((group, index) => {
      group[1].initializeAllMarkers();
      this.allGroupLayers.push(group[1]);
      this.layerSupportGroup.checkIn(group[1]);


      //Create specific filter for group
      let filter = new FilterDTO(group[0], group[1].getCurrentMarkers().length, group[1].type);
      if (index === 0) {
        // group[1].addTo(this.map);
        // this.selectedSources.push(filter);
      }
      // this.layerControl.addOverlay(group[1], this.getIconClassForSource(group[0]).toString())
      this.sourcesFromGroups.push(filter)
    });

    this.layerControl.addTo(this.map);

    this.markersLoaded = true;
    this.cdRef.markForCheck();


    this.updateSlider();
  }

  areOptionsLoaded() {
    return this.options;
  }

  updateProgressBar(processed, total, elapsed, layersArray): void {
    if (this === undefined) {
      return;
    }


  }


  // TODO: Move this in a template
  // ################### POP UP VIEW ###########################
  public getTweetCardHTML(tweet: Tweet): String {


    let user = tweet.details.user;
    let htmlContent = "<figure class=\"tweet-pop-up\">\n" +
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
      "      <div class=\"icons\">" +
      "           <img src='" + this.randomUtils.getFlagLinkForLanguage(tweet.language) + "' style='margin-bottom:-5px;'/>" +
      "           <span><i class=\"" + this.randomUtils.getIconClassForSource(tweet.source) + "\" style='font-size:29px'></i></span>\n " +
      "      </div>\n" +
      "      <p>" + tweet.details.tweetText + "</p>\n" +
      "      <div>" + tweet.createdAt + "</div>" +
      "    </figcaption>\n" +
      "  </figure>"
    return htmlContent;
  }

  // ############################FILTERING AREA#################################
  //TODO: Please find a better way to disable this.
  onItemSelect(item: FilterDTO) {

    this.allGroupLayers.forEach(group => {
      if (this.selectedFilter[item.filterType].map(l => l.filterValue).indexOf(group.name) >= 0) {
        this.map.addLayer(group);
        // this.layerSupportGroup.checkIn(group);
        group.selected = true;
        this.handleSliderChangeForGroup(group, { floor: this.currentSliderFloor, ceil: this.currentSliderCeil });
      }
    });

    this.refreshFilterState();

    // this.handleFilterChange(item.filterType);
  }

  //Custom marker filter
  applyFilter(data: CustomLayerGroup, filters: any) {
    return data.getCurrentMarkers().filter((item: CustomMarker) => {
      return Object.keys(filters).map(f => {
        return filters[f].length === 0 || filters[f].map(d => d.filterValue).indexOf(item.applicableFilter[f]) >= 0 && data.type === f
      }).reduce((x, y) => x && y, true);
    });
  }

  async OnItemDeSelect(item: FilterDTO) {

    let toRemoveGroup = this.allGroupLayers.filter(group => group.getGroupName() === item.filterValue)[0];

    if (toRemoveGroup) {

      if (this.getElapsedTime(toRemoveGroup) > 1000) {
        this.markersLoaded = false;
        setTimeout(() => {
          this.map.removeLayer(toRemoveGroup);
          toRemoveGroup.selected = false;
          this.markersLoaded = true;
        }, this.getElapsedTime(toRemoveGroup) - 500);
      } else {
        this.map.removeLayer(toRemoveGroup);
        toRemoveGroup.selected = false;
      }
    }

    this.refreshFilterState();
    // this.handleFilterChange(item.filterType);
  }

  getElapsedTime(group: CustomLayerGroup): number {
    return group.getCurrentMarkers().length / 10;
  }


  onSelectAll(items: FilterDTO[]) {

    this.allGroupLayers.forEach(group => this.map.removeLayer(group));

    //Case of which no filter is selected.
    this.allGroupLayers.filter(group => group.getType() === items[0].filterType).forEach(group => {
      this.map.addLayer(group);
      group.selected = true;
    });

    this.refreshFilterState();

    // this.handleFilterChange(items[0].filterType);
  }

  //TODO: Handle laoding screen for deselecting all the markers
  onDeSelectAll(items: FilterDTO[]) {
    this.allGroupLayers.forEach(g => {
      this.map.removeLayer(g);
      g.selected = false;
    });

    this.refreshFilterState();
    // this.handleFilterChange(items[0].filterType);
  }


  //TODO: Find a way for multiple filters active.
  handleFilterChange(filterType: string): void {

    this.allGroupLayers.filter(g => g.isSelected()).forEach(g => {
      g.getCurrentMarkers().forEach((m: CustomMarker) => {
        if (!this.matchesTheSelectedFilters(m, g.getType())) {
          g.removeLayer(m);
          g.filteredMarkers.push(m);
        }
      });

      //Handle unfilter markers
      for (let i = g.filteredMarkers.length; i--;) {
        let marker = g.filteredMarkers[i];

        if (this.matchesTheSelectedFilters(marker, g.getType())) {
          g.addLayer(marker);
          g.filteredMarkers.splice(i, 1);
        }
      }
    });

  }

  matchesTheSelectedFilters(m: CustomMarker, groupType: String): boolean {
    let activeFilters = [];

    let excludedFilters = this.filters;
    let filterValues = excludedFilters.map(filterKey => this.selectedFilter[filterKey].map((f: FilterDTO) => f.filterValue));

    activeFilters = activeFilters.concat.apply([], filterValues);

    return m.getMarkerFilters().every((val) => activeFilters.includes(val))
  }

  //Refactor
  getDropdownSettings(lists: any[]) {
    return {
      singleSelection: false,
      primaryKey: 'filterValue',
      labelKey: 'filterValue',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      badgeShowLimit: 3,
      maxHeight: 200,
      enableSearchFilter: true,
      disabled: lists.filter(l => l.length > 0).length > 0
    };
  }

  private refreshFilterState() {
    this.sourcesSettings = this.getDropdownSettings([this.selectedFilter['LANGUAGE']]);
    this.languagesSettings = this.getDropdownSettings([this.selectedFilter['SOURCE']]);
  }


  // ###########################MESSAGE AREA#################################
  refreshTweetWithinBounds() {
    let tweetWithinBounds = [];

    let currentlyActiveMarkers = this.getCurrentlyActiveMarkers();
    let markersIds = currentlyActiveMarkers.filter(m => this.map.getBounds().contains(m.getLatLng())).map((m: CustomMarker) => m.tweet.id);

    tweetWithinBounds.push(...markersIds);

    this.tweetsWithinBounds = tweetWithinBounds;
  }

  retrieveTweetForMarkersWithinBounds() {
    if (this.tweetsWithinBounds.length !== 0) {
      this.tweetService.getTweetsByIds(this.tweetsWithinBounds).subscribe(tweets => {
        this.tweetsInMessageArea = tweets.sort((a, b) => Date.parse(b.createdAt.toString()) - Date.parse(a.createdAt.toString()));
      })
    }
  }


  // ############################SLIDER AREA#################################
  private updateSlider() {
    let options = {} as Options;
    let currentlyActiveMarkers = this.getCurrentlyActiveMarkers();
    let earliestDate = new Date();
    let latestDate = new Date();

    if (currentlyActiveMarkers.length > 0) {
      currentlyActiveMarkers.forEach((m: CustomMarker) => {
        let tweetDate = Date.parse(m.tweet.createdAt.toString());
        if (tweetDate > latestDate.getTime()) {
          latestDate = new Date(tweetDate);
        }

        if (tweetDate < earliestDate.getTime()) {
          earliestDate = new Date(tweetDate);
        }
      });

      earliestDate.setHours(0, 0, 0, 0);
      earliestDate.setDate(earliestDate.getDate() - 1);
      latestDate.setHours(0, 0, 0, 0);
      latestDate.setDate(latestDate.getDate() + 2);

      let stepArrays = _.range(earliestDate.getTime(), latestDate.getTime(), 86400000).map(v => {
        let c = {} as CustomStepDefinition;

        c.value = v;
        c.legend = new Date(v).toDateString();

        return c;
      });
      this.value = stepArrays[0].value;
      this.highValue = stepArrays[stepArrays.length - 1].value;

      options.floor = stepArrays[0].value;
      options.ceil = stepArrays[stepArrays.length - 1].value;
      options.stepsArray = stepArrays;
      options.autoHideLimitLabels = true;
      options.translate = (v) => {
        return this.datePipe.transform(new Date(v), 'yyyy-MM-dd');
      }
    } else {
      options.hidePointerLabels = true;
      options.hideLimitLabels = true;

      options.disabled = true;
      return;
    }

    this.sliderOptions = options;
    this.currentSliderFloor = this.sliderOptions.floor;
    this.currentSliderCeil = this.sliderOptions.ceil;
  }

  handleSliderChange(event: ChangeContext): void {
    this.allGroupLayers.forEach(g => this.handleSliderChangeForGroup(g, {
        floor: event.value,
        ceil: event.highValue
      })
    );

    this.currentSliderFloor = event.value;
    this.currentSliderCeil = event.highValue;

  }

  //TODO: Use this in case of filtering from BE.
  createFilterDTO(): FilterItemDto {
    let filterDTO = new FilterItemDto();
    filterDTO.range = { start: new Date(this.currentSliderFloor), end: new Date(this.currentSliderCeil) };
    filterDTO.filters.push({ type: 'LANGUAGE', values: []});
    filterDTO.filters.push({ type: 'SOURCE', values: this.selectedFilter['SOURCE'] });
    return filterDTO;
  }

  handleSliderChangeForGroup(group: CustomLayerGroup, event: any): void {
    let toRemoveMarkers: CustomMarker[] = [];
    let toAddMarkers: CustomMarker[] = [];

    group.getCurrentMarkers().forEach((m: CustomMarker) => {
      let tweetDate = new Date(m.tweet.createdAt.toString()).getTime();
      if (!(tweetDate > event.floor && tweetDate < event.ceil)) {
        group.removeLayer(m);
        // toRemoveMarkers.push(m);
        group.filteredMarkers.push(m);
      }
    });

    //Handle unfilter markers
    for (let i = group.filteredMarkers.length; i--;) {
      let marker = group.filteredMarkers[i];
      let tweetDate = new Date(marker.tweet.createdAt.toString()).getTime();

      //Added 23:59 hours to search in the selected day as well
      if (tweetDate >= event.floor && tweetDate <= event.ceil + 86340000) {
        group.addLayer(marker);
        // toAddMarkers.push(marker);
        group.filteredMarkers.splice(i, 1);
      }
    }

    this.updateFilterCount(group);
    // group.removeLayers(toRemoveMarkers);
    // group.addLayers(toAddMarkers);
  }

  updateFilterCount(group: CustomLayerGroup): void {
    let filter;

    switch (group.getType()) {
      case "SOURCE":
        this.sourcesFromGroups.filter(s => s.filterValue == group.getGroupName()).forEach(f => {
          f.count = group.getCurrentMarkers().length;
        });
        break;
      case "LANGUAGE":
        filter = this.languagesFromGroups.filter(s => s.filterValue == group.getGroupName()).forEach(f => {
          f.count = group.getCurrentMarkers().length;
        });
        break;

      default: {
      }

    }
  }

  // ############################MARKER UTILS AREA######################
  goToMarker(id: String) {
    this.markers.forEach(m => {
      if (m.tweet.id === id) {
        this.map.flyTo(m.getLatLng(), 18, { duration: 2, easeLinearity: 0.5 });
      }
    });
  }

  getCurrentlyActiveMarkers(): CustomMarker[] {

    return this.allGroupLayers.filter(g => g.isSelected()).map(g => g.getCurrentMarkers()).reduce((p, c) => {
      return p.concat(c);
    }, []);

  }

  getMarkersFromTweets(tweets: any[]): CustomMarker[] {
    return tweets.map(tweet => {
      if (tweet.latitude && tweet.longitude) {
        const marker = new CustomMarker(tweet,
          [tweet.latitude, tweet.longitude],
          { icon: this.mapUtils.getIcon() }
        );

        marker.on('click', function (e) {
          this.tweetService.getTweetById(marker.tweet.id).subscribe(retrievedTweet => {
            L.popup().setLatLng(e.target._latlng).setContent(this.getTweetCardHTML(retrievedTweet)).openOn(e.target._map);
          });
        }.bind(this));

        return marker;
      }
    });
  }

  // TODO: Move this in another component
  // ############################ MENU STATES HANDLING #################################
  toggleMenu() {
    this.filterMenuState = this.filterMenuState === 'out' ? 'in' : 'out';
  }

  toggleMessageMenu() {
    this.messageMenuState = this.messageMenuState === 'in' ? 'out' : 'in';
  }

  // ########################### STATISTICS ########################################
  getStatistics() {
    let filterDTO = new FilterItemDto();
    filterDTO.filterValues = this.getAllActiveFilters();
    filterDTO.range.start = new Date(this.currentSliderFloor);
    filterDTO.range.end = new Date(this.currentSliderCeil);
    let stats = this.tweetService.getStatisticsBasedOnFilters(filterDTO);

  }

  getAllActiveFilters(): string[]{
    return [].concat.apply([], this.filters.map(f => this.selectedFilter[f].map((filter: FilterDTO) => filter.filterValue)));
  }


  // ############################OUTDATED IMPLEMENTATIONS#################################
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

}
