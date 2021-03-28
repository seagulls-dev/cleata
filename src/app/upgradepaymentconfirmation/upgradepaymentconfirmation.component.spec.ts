import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradepaymentconfirmationComponent } from './upgradepaymentconfirmation.component';

describe('UpgradepaymentconfirmationComponent', () => {
  let component: UpgradepaymentconfirmationComponent;
  let fixture: ComponentFixture<UpgradepaymentconfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpgradepaymentconfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpgradepaymentconfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
