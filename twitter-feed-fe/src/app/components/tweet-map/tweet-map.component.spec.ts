import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TweetMapComponent } from './tweet-map.component';

describe('TweetMapComponent', () => {
  let component: TweetMapComponent;
  let fixture: ComponentFixture<TweetMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TweetMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TweetMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
