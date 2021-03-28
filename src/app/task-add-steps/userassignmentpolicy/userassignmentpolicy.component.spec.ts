import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserassignmentpolicyComponent } from './userassignmentpolicy.component';

describe('UserassignmentpolicyComponent', () => {
  let component: UserassignmentpolicyComponent;
  let fixture: ComponentFixture<UserassignmentpolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserassignmentpolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserassignmentpolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
