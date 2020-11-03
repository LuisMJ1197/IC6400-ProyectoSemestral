import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArbolesbinariosComponent } from './arbolesbinarios.component';

describe('ArbolesbinariosComponent', () => {
  let component: ArbolesbinariosComponent;
  let fixture: ComponentFixture<ArbolesbinariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArbolesbinariosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArbolesbinariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
