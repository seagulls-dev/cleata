import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UncategorizedresulttoteamsComponent } from './uncategorizedresulttoteams.component';

describe('UncategorizedresulttoteamsComponent', () => {
  let component: UncategorizedresulttoteamsComponent;
  let fixture: ComponentFixture<UncategorizedresulttoteamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UncategorizedresulttoteamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UncategorizedresulttoteamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
