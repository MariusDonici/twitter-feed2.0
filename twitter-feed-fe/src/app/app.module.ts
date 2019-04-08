import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {AppComponent} from "./app.component";
import {HttpClientModule} from "@angular/common/http";
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {SocketIoConfig, SocketIoModule} from "ng-socket-io";
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import {MapUtils} from "./utils/map-utils";
import {MagicMapComponent} from "./components/magic-map/magic-map.component";
import {LeafletMarkerClusterModule} from "@asymmetrik/ngx-leaflet-markercluster";
import {LoadingModule} from "ngx-loading";
import {KeysPipe} from "./pipes/keys-pipe";
import {SliderMenuComponent} from "./components/slider-menu/slider-menu.component";
import {DataAggregationUtils} from "./utils/data-aggregation-utils";
import {MatButtonModule, MatFormFieldModule, MatInputModule, MatRippleModule, MatSelectModule} from "@angular/material";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import {AngularMultiSelectModule} from "angular2-multiselect-dropdown";
import {RandomUtils} from "./utils/random-utils";

const config: SocketIoConfig = {
  url: "http://localhost:9000/stomp",
  options: {}
};

const modules = [
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatRippleModule,
  MatSelectModule,
  ReactiveFormsModule,
  FormsModule
];


@NgModule({
  declarations: [
    AppComponent,
    MagicMapComponent,
    KeysPipe,
    SliderMenuComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    SocketIoModule.forRoot(config),
    LeafletModule.forRoot(),
    LeafletMarkerClusterModule,
    LoadingModule,
    NgMultiSelectDropDownModule.forRoot(),
    AngularMultiSelectModule,
    modules
  ],
  providers: [MapUtils, RandomUtils, KeysPipe, DataAggregationUtils],
  bootstrap: [AppComponent]
})
export class AppModule {
}
