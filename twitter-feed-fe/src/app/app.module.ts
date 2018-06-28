import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AgmCoreModule } from "@agm/core";
import { AppComponent } from "./app.component";
import { AgmJsMarkerClustererModule } from "@agm/js-marker-clusterer";
import { ClusterManager } from "@agm/js-marker-clusterer/services/managers/cluster-manager";
import { TweetMapComponent } from "./components/tweet-map/tweet-map.component";
import { HttpClientModule } from "@angular/common/http";
import { AgmSnazzyInfoWindowModule } from "@agm/snazzy-info-window";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SocketIoConfig, SocketIoModule } from "ng-socket-io";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { LeafletMapComponent } from "./components/leaflet-map/leaflet-map.component";
import { MapUtils } from "./utils/map-utils";
import { MagicMapComponent } from "./components/magic-map/magic-map.component";
import { LeafletMarkerClusterModule } from "@asymmetrik/ngx-leaflet-markercluster";
import { LoadingModule } from "ngx-loading";
import { KeysPipe } from "./pipes/keys-pipe";

const config: SocketIoConfig = {
  url: "http://localhost:9000/stomp",
  options: {}
};

@NgModule({
  declarations: [
    AppComponent,
    TweetMapComponent,
    LeafletMapComponent,
    MagicMapComponent,
    KeysPipe
  ],
  imports: [
    BrowserModule,
    AgmJsMarkerClustererModule,
    HttpClientModule,
    AgmSnazzyInfoWindowModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    SocketIoModule.forRoot(config),
    LeafletModule.forRoot(),
    LeafletMarkerClusterModule,
    LoadingModule
  ],
  providers: [ClusterManager, MapUtils, KeysPipe],
  bootstrap: [AppComponent]
})
export class AppModule {}
