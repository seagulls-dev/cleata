import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetstartdateComponent } from './setstartdate.component';

describe('SetstartdateComponent', () => {
  let component: SetstartdateComponent;
  let fixture: ComponentFixture<SetstartdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetstartdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetstartdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
