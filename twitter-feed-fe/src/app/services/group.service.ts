import {Injectable} from "@angular/core";
import {CustomLayerGroup} from "../models/CustomLayerGroup";


@Injectable({
  providedIn: "root"
})
export class GroupService {
  constructor() {
  }

  /*
    @filterValues - filters values that a group is needed
    @filterType - the filter type. For now is a string instead an ENUM
    @groupToRetrieve - number of groups to generate based on the number of filter values

    Return a map with key: group name, value: the generated group.
   */
  retrieveGroupsForFilter(filterValues: any[], filterType: string, groupToRetrieve?: number): Map<string, CustomLayerGroup> {
    filterValues.splice(groupToRetrieve, filterValues.length - groupToRetrieve);

    let customLayerGroups = filterValues.map((l) => new CustomLayerGroup([], null, l[0][0], filterType));
    customLayerGroups.push(new CustomLayerGroup([], null, 'other', filterType));

    let customLayerGroupMap = new Map();

    customLayerGroups.forEach((g) => customLayerGroupMap.set(g.name, g));

    return customLayerGroupMap;
  }
}
