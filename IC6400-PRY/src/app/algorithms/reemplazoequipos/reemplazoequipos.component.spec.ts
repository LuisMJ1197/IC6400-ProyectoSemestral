import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReemplazoequiposComponent } from './reemplazoequipos.component';

describe('ReemplazoequiposComponent', () => {
  let component: ReemplazoequiposComponent;
  let fixture: ComponentFixture<ReemplazoequiposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReemplazoequiposComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReemplazoequiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
