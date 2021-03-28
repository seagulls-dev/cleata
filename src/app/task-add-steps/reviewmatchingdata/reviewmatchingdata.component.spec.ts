import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewmatchingdataComponent } from './reviewmatchingdata.component';

describe('ReviewmatchingdataComponent', () => {
  let component: ReviewmatchingdataComponent;
  let fixture: ComponentFixture<ReviewmatchingdataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewmatchingdataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewmatchingdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
