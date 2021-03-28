import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignheaderComponent } from './assignheader.component';

describe('AssignheaderComponent', () => {
  let component: AssignheaderComponent;
  let fixture: ComponentFixture<AssignheaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignheaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
