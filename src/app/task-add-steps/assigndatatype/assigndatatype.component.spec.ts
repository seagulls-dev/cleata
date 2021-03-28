import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssigndatatypeComponent } from './assigndatatype.component';

describe('AssigndatatypeComponent', () => {
  let component: AssigndatatypeComponent;
  let fixture: ComponentFixture<AssigndatatypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssigndatatypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssigndatatypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
