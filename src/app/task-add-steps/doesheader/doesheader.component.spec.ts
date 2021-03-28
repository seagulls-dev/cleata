import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoesheaderComponent } from './doesheader.component';

describe('DoesheaderComponent', () => {
  let component: DoesheaderComponent;
  let fixture: ComponentFixture<DoesheaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoesheaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoesheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
