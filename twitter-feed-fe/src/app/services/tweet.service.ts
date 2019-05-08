import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tweet } from '../models/tweet';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
// tslint:disable-next-line:import-blacklist
import 'rxjs/Rx';
import { FilterItemDto } from "../models/filter-item-dto";

@Injectable({
  providedIn: 'root'
})
export class TweetService {
  tweetUrl = 'http://localhost:9051/tweets';  // URL to web api
  wsUrl = 'http://localhost:9000/stomp';
  localJson = 'assets/tweets.json';

  constructor(private http: HttpClient) {
  }

  private socket;

  private pageNumber = 0;
  private sizeOfPage = 700;

  private sockJsSubject: Subject<Tweet> = new Subject<Tweet>();

  onStreamMessage(): Observable<Tweet> {
    return this.sockJsSubject.asObservable();
  }


  /** GET heroes from the server */
  public getTweets(page: number, size: number): Observable<any[]> {
    // const params = new HttpParams({
    //   fromObject: {
    //     page: page.toString(),
    //     size: size.toString()
    //   }
    // });

    return this.http.get<Tweet[]>(this.tweetUrl);
    // return this.http.get<Tweet[]>(this.localJson);
  }

  public getTweetById(id: string): Observable<Tweet> {
    return this.http.get<Tweet>(this.tweetUrl + "/" + id);
  }

  public getTweetsByIds(ids: number[]): Observable<Tweet[]> {
    return this.http.get<Tweet[]>(this.tweetUrl + "/list?ids=" + ids.join(","))
  }

  public getStatisticsBasedOnFilters(filters: FilterItemDto): Observable<Tweet[]> {
    return this.http.post<Tweet[]>(this.tweetUrl + "/filter", filters);
  }

  public retrieveTweets(): Observable<any[]> {
    return this.getTweets(this.pageNumber, this.sizeOfPage);

    // return this.getTweets(this.pageNumber, this.sizeOfPage).concatMap((tweets: Tweet[]) => {
    //   if (tweets.length > 0) {
    //     this.pageNumber++;
    //     return this.retrieveTweets().map((temp) => tweets.concat(temp));
    //   }

    //   return Observable.of(tweets);
    // });
  }


}
