import { Layer, LayerGroup, LayerOptions } from "leaflet";
import * as L from "leaflet";
import { CustomMarker } from "./marker";

export class CustomLayerGroup extends LayerGroup {

  name: string;

  //TYPE: LANGUAGE, SOURCE
  type: string;
  selected: boolean = false;
  filteredMarkers: CustomMarker[] = [];
  allMarkers: CustomMarker[] = [];

  constructor(layers?: Layer[], options?: LayerOptions, groupName?: string, type?: string) {
    super(layers, options);
    this.name = groupName;
    this.type = type;
  }

  getCurrentMarkers(): CustomMarker[] {
    return this.getLayers() as CustomMarker[];
  }

  getGroupName(): string {
    return this.name;
  }

  setGroupName(groupName: string): void {
    this.name = groupName;
  }

  isSelected(): boolean {
    return this.selected;
  }

  setSelected(selected: boolean): void {
    this.selected = selected;
  }


  getType(): string {
    return this.type;
  }

  setType(type: string): void {
    this.type = type;
  }

  initializeAllMarkers():void{
    this.allMarkers = this.getCurrentMarkers();
  }
}
