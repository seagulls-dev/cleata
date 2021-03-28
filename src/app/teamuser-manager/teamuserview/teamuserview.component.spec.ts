import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamuserviewComponent } from './teamuserview.component';

describe('TeamuserviewComponent', () => {
  let component: TeamuserviewComponent;
  let fixture: ComponentFixture<TeamuserviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamuserviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamuserviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
