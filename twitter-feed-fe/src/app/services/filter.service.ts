import { Injectable } from "@angular/core";
import { Tweet } from "../models/tweet";

@Injectable({
  providedIn: "root"
})
export class FilterService {
  constructor() {
  }

  filterTweets({ start, end }): Tweet[] {
    return ;
  }
}
