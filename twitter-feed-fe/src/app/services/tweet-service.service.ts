import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Tweet } from '../models/tweet';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
import 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class TweetService {
  tweetUrl = 'http://localhost:9005/retrieve';  // URL to web api
  wsUrl = 'http://localhost:9000/stomp';

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
    let params = new HttpParams({
      fromObject: {
        page: page.toString(),
        size: size.toString()
      }
    });

    return this.http.get<Tweet[]>(this.tweetUrl, { params: params });
  }

  public retrieveHeroesPageable(): Observable<any[]> {
    this.getTweets(this.pageNumber, this.sizeOfPage);

    return this.getTweets(this.pageNumber, this.sizeOfPage).concatMap((tweets: Tweet[]) => {
      if (tweets.length > 0) {
        this.pageNumber++;
        return this.retrieveHeroesPageable().map((temp) => tweets.concat(temp));
      }

      return Observable.of(tweets);
    });
  }
}
