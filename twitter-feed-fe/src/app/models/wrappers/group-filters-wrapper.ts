import { CustomLayerGroup } from "../CustomLayerGroup";

export class GroupFiltersWrapper{
  filterType: string;
  groups: CustomLayerGroup[];

  constructor(filterType: string, groups: CustomLayerGroup[]){
    this.filterType = filterType;
    this.groups = groups;
  }
}
