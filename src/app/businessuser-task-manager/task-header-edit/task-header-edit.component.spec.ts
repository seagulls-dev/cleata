import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskHeaderEditComponent } from './task-header-edit.component';

describe('TaskHeaderEditComponent', () => {
  let component: TaskHeaderEditComponent;
  let fixture: ComponentFixture<TaskHeaderEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskHeaderEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskHeaderEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
