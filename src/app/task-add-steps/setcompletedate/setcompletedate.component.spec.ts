import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetcompletedateComponent } from './setcompletedate.component';

describe('SetcompletedateComponent', () => {
  let component: SetcompletedateComponent;
  let fixture: ComponentFixture<SetcompletedateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetcompletedateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetcompletedateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
