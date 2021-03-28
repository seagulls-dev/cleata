import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UncategorizedtasklistComponent } from './uncategorizedtasklist.component';

describe('UncategorizedtasklistComponent', () => {
  let component: UncategorizedtasklistComponent;
  let fixture: ComponentFixture<UncategorizedtasklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UncategorizedtasklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UncategorizedtasklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
