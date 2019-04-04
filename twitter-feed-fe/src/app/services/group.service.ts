import { Injectable } from "@angular/core";
import { CustomLayerGroup } from "../models/CustomLayerGroup";


@Injectable({
  providedIn: "root"
})
export class GroupService {
  constructor() {
  }


  public retrieveLanguageGroups(languages: any[], groupToRetrieve: number): Map<string, CustomLayerGroup> {

    languages.splice(groupToRetrieve, languages.length - groupToRetrieve);

    let customLayerGroups = languages.map((l) => new CustomLayerGroup([], null, l[0][0], GroupType.LANGUAGE));
    customLayerGroups.push(new CustomLayerGroup([], null, 'other', GroupType.LANGUAGE));

    let customLayerGroupMap = new Map();

    customLayerGroups.forEach((g) => customLayerGroupMap.set(g.name, g));


    return customLayerGroupMap;
  }

  public retrieveSourceGroups(sources: any[], groupToRetrieve: number): Map<string, CustomLayerGroup> {

    sources.splice(groupToRetrieve, sources.length - groupToRetrieve);

    let customLayerGroups = sources.map((l) => new CustomLayerGroup([], null, l[0][0], GroupType.SOURCE));
    customLayerGroups.push(new CustomLayerGroup([], null, 'other', GroupType.SOURCE));

    let customLayerGroupMap = new Map();

    customLayerGroups.forEach((g) => customLayerGroupMap.set(g.name, g));


    return customLayerGroupMap;
  }
}
