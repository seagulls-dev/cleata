import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamuserlistComponent } from './teamuserlist.component';

describe('TeamuserlistComponent', () => {
  let component: TeamuserlistComponent;
  let fixture: ComponentFixture<TeamuserlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamuserlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamuserlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
