import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurebusinessrulesComponent } from './configurebusinessrules.component';

describe('ConfigurebusinessrulesComponent', () => {
  let component: ConfigurebusinessrulesComponent;
  let fixture: ComponentFixture<ConfigurebusinessrulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurebusinessrulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurebusinessrulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
