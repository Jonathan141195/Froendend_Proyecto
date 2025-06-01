import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertaAcademicaComponent } from './oferta-academica.component';

describe('OfertaAcademicaComponent', () => {
  let component: OfertaAcademicaComponent;
  let fixture: ComponentFixture<OfertaAcademicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfertaAcademicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfertaAcademicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
