import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AgmCoreModule} from '@agm/core';
import {AppComponent} from './app.component';
import {AgmJsMarkerClustererModule} from '@agm/js-marker-clusterer';
import {ClusterManager} from '@agm/js-marker-clusterer/services/managers/cluster-manager';
import {TweetMapComponent} from './components/tweet-map/tweet-map.component';
import {HttpClientModule} from '@angular/common/http';
import {AgmSnazzyInfoWindowModule} from '@agm/snazzy-info-window';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SocketIoConfig, SocketIoModule} from 'ng-socket-io';
import {LeafletModule} from "@asymmetrik/ngx-leaflet";

const config: SocketIoConfig = {url: 'http://localhost:9000/stomp', options: {}};

@NgModule({
  declarations: [
    AppComponent,
    TweetMapComponent,
  ],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: 'apiKey'
    }),
    AgmJsMarkerClustererModule,
    HttpClientModule,
    AgmSnazzyInfoWindowModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [
    ClusterManager,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
