import { Layer, LayerGroup, LayerOptions } from "leaflet";

export class CustomLayerGroup extends LayerGroup {

  name: string;

  //TYPE: LANGUAGE, SOURCE
  type: string;
  selected: boolean = true;

  constructor(layers?: Layer[], options?: LayerOptions, groupName?: string, type?: string) {
    super(layers, options);
    this.name = groupName;
    this.type = type;
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

  setType(type: string): void{
    this.type = type;
  }


}
