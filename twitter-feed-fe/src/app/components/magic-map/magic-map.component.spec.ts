import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MagicMapComponent } from './magic-map.component';

describe('MagicMapComponent', () => {
  let component: MagicMapComponent;
  let fixture: ComponentFixture<MagicMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MagicMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MagicMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
