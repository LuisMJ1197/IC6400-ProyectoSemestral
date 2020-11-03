import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesdeportivasComponent } from './seriesdeportivas.component';

describe('SeriesdeportivasComponent', () => {
  let component: SeriesdeportivasComponent;
  let fixture: ComponentFixture<SeriesdeportivasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeriesdeportivasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesdeportivasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
