import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskviewformComponent } from './taskviewform.component';

describe('TaskviewformComponent', () => {
  let component: TaskviewformComponent;
  let fixture: ComponentFixture<TaskviewformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskviewformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskviewformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
