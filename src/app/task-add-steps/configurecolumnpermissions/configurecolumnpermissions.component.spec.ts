import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurecolumnpermissionsComponent } from './configurecolumnpermissions.component';

describe('ConfigurecolumnpermissionsComponent', () => {
  let component: ConfigurecolumnpermissionsComponent;
  let fixture: ComponentFixture<ConfigurecolumnpermissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurecolumnpermissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurecolumnpermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
