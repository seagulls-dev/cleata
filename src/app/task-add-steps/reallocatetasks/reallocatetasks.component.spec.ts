import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReallocatetasksComponent } from './reallocatetasks.component';

describe('ReallocatetasksComponent', () => {
  let component: ReallocatetasksComponent;
  let fixture: ComponentFixture<ReallocatetasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReallocatetasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReallocatetasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
