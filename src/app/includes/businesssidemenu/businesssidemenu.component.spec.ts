import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinesssidemenuComponent } from './businesssidemenu.component';

describe('BusinesssidemenuComponent', () => {
  let component: BusinesssidemenuComponent;
  let fixture: ComponentFixture<BusinesssidemenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinesssidemenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinesssidemenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
