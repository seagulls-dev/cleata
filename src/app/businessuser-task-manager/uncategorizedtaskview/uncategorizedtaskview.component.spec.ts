import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UncategorizedtaskviewComponent } from './uncategorizedtaskview.component';

describe('UncategorizedtaskviewComponent', () => {
  let component: UncategorizedtaskviewComponent;
  let fixture: ComponentFixture<UncategorizedtaskviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UncategorizedtaskviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UncategorizedtaskviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
