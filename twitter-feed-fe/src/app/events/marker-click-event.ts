import { LeafletEvent, LeafletMouseEvent } from "leaflet";

export interface MarkerClickEvent extends LeafletMouseEvent {
    content: any;
}
