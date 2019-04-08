import * as L from "leaflet";
import { Injectable } from "@angular/core";

@Injectable()
export class MapUtils {
  googleMaps = L.tileLayer(
    "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    {
      maxZoom: 40,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
      detectRetina: true,
      zIndex: 1
    }
  );

  googleHybrid = L.tileLayer(
    "http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}",
    {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
      detectRetina: true,
      zIndex: 1
    }
  );
  openTopoMap = L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 17,
      attribution:
        'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    }
  );

  getIcon() {
    return L.icon({
      iconSize: [25, 41],
      iconAnchor: [13, 41],
      iconUrl:
        "https://npmcdn.com/leaflet@1.0.0-rc.3/dist/images/marker-icon.png",
      shadowUrl:
        "https://npmcdn.com/leaflet@1.0.0-rc.3/dist/images/marker-shadow.png"
    });
  }

  getMapOptions(position: L.LatLng): L.MapOptions {
    return {
      minZoom: 1,
      layers: [this.googleMaps],
      zoom: 7,
      center: position
    };
  }
}
