import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamuserDashboardComponent } from './teamuser-dashboard.component';

describe('TeamuserDashboardComponent', () => {
  let component: TeamuserDashboardComponent;
  let fixture: ComponentFixture<TeamuserDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamuserDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamuserDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
