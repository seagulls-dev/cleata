import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamuseraddComponent } from './teamuseradd.component';

describe('TeamuseraddComponent', () => {
  let component: TeamuseraddComponent;
  let fixture: ComponentFixture<TeamuseraddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamuseraddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamuseraddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
