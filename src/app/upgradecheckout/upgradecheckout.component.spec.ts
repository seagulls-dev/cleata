import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradecheckoutComponent } from './upgradecheckout.component';

describe('UpgradecheckoutComponent', () => {
  let component: UpgradecheckoutComponent;
  let fixture: ComponentFixture<UpgradecheckoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpgradecheckoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpgradecheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
