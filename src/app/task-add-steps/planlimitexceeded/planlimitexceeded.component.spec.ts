import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanlimitexceededComponent } from './planlimitexceeded.component';

describe('PlanlimitexceededComponent', () => {
  let component: PlanlimitexceededComponent;
  let fixture: ComponentFixture<PlanlimitexceededComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanlimitexceededComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanlimitexceededComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
