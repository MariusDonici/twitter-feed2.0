import * as L from 'leaflet';
declare module 'leaflet' {
   namespace control {
       function sliderControl(v: any);
   }

   namespace markerClusterGroup{
     function layerSupport(v: any);
   }
}
