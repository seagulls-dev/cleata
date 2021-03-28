import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocateteamComponent } from './allocateteam.component';

describe('AllocateteamComponent', () => {
  let component: AllocateteamComponent;
  let fixture: ComponentFixture<AllocateteamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllocateteamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocateteamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
