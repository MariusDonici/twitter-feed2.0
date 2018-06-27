import { Injectable } from "@angular/core";
import * as L from "leaflet";
import { MapUtils } from "../utils/map-utils";
import { TweetService } from "./tweet.service";

@Injectable({
  providedIn: "root"
})
export class MapService {
  public baseMaps: any;

  constructor(private mapUtils: MapUtils, private tweetService: TweetService) {
    this.baseMaps = {
      "Google Maps": this.mapUtils.googleMaps,
      "Google Maps Hybrid": this.mapUtils.googleHybrid,
      "Open Topographic Map": this.mapUtils.openTopoMap
    };
  }
}
