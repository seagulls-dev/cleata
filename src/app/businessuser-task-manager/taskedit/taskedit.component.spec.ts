import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskeditComponent } from './taskedit.component';

describe('TaskeditComponent', () => {
  let component: TaskeditComponent;
  let fixture: ComponentFixture<TaskeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
