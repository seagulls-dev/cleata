import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamusereditComponent } from './teamuseredit.component';

describe('TeamusereditComponent', () => {
  let component: TeamusereditComponent;
  let fixture: ComponentFixture<TeamusereditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamusereditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamusereditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
