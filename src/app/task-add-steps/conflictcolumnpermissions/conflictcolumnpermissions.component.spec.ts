import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConflictcolumnpermissionsComponent } from './conflictcolumnpermissions.component';

describe('ConflictcolumnpermissionsComponent', () => {
  let component: ConflictcolumnpermissionsComponent;
  let fixture: ComponentFixture<ConflictcolumnpermissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConflictcolumnpermissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConflictcolumnpermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
