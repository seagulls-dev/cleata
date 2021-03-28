import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsummaryComponent } from './jobsummary.component';

describe('JobsummaryComponent', () => {
  let component: JobsummaryComponent;
  let fixture: ComponentFixture<JobsummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
