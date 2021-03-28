import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamaddComponent } from './teamadd.component';

describe('TeamaddComponent', () => {
  let component: TeamaddComponent;
  let fixture: ComponentFixture<TeamaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
