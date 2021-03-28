import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskrulesaddComponent } from './taskrulesadd.component';

describe('TaskrulesaddComponent', () => {
  let component: TaskrulesaddComponent;
  let fixture: ComponentFixture<TaskrulesaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskrulesaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskrulesaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
