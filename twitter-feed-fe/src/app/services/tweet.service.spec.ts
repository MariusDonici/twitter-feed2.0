import { TestBed, inject } from '@angular/core/testing';

import { TweetService } from './tweet.service';

describe('TweetServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TweetService]
    });
  });

  it('should be created', inject([TweetService], (service: TweetService) => {
    expect(service).toBeTruthy();
  }));
});
