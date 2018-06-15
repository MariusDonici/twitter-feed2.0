import { TestBed, inject } from '@angular/core/testing';

import { TweetServiceService } from './tweet-service.service';

describe('TweetServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TweetServiceService]
    });
  });

  it('should be created', inject([TweetServiceService], (service: TweetServiceService) => {
    expect(service).toBeTruthy();
  }));
});
