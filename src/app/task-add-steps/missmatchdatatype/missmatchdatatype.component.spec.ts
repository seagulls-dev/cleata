import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissmatchdatatypeComponent } from './missmatchdatatype.component';

describe('MissmatchdatatypeComponent', () => {
  let component: MissmatchdatatypeComponent;
  let fixture: ComponentFixture<MissmatchdatatypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissmatchdatatypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissmatchdatatypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
