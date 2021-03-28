import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeameditComponent } from './teamedit.component';

describe('TeameditComponent', () => {
  let component: TeameditComponent;
  let fixture: ComponentFixture<TeameditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeameditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeameditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
