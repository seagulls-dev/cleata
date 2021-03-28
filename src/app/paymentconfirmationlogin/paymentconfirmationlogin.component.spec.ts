import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentconfirmationloginComponent } from './paymentconfirmationlogin.component';

describe('PaymentconfirmationloginComponent', () => {
  let component: PaymentconfirmationloginComponent;
  let fixture: ComponentFixture<PaymentconfirmationloginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentconfirmationloginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentconfirmationloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
