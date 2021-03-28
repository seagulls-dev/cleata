import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistercheckoutComponent } from './registercheckout.component';

describe('RegistercheckoutComponent', () => {
  let component: RegistercheckoutComponent;
  let fixture: ComponentFixture<RegistercheckoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistercheckoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistercheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
