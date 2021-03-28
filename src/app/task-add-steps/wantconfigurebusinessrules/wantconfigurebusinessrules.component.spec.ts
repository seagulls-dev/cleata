import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WantconfigurebusinessrulesComponent } from './wantconfigurebusinessrules.component';

describe('WantconfigurebusinessrulesComponent', () => {
  let component: WantconfigurebusinessrulesComponent;
  let fixture: ComponentFixture<WantconfigurebusinessrulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WantconfigurebusinessrulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WantconfigurebusinessrulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
