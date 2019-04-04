import { Layer, LayerGroup, LayerOptions } from "leaflet";

export class CustomLayerGroup extends LayerGroup {

  name: string;
  type: GroupType;
  selected: boolean = true;

  constructor(layers?: Layer[], options?: LayerOptions, groupName?: string, type?: GroupType) {
    super(layers, options);
    this.name = groupName;
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


  getType(): GroupType {
    return this.type;
  }

  setType(type: GroupType): void{
    this.type = type;
  }


}
