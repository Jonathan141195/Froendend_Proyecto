import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearOfertaAcademicaComponent } from './crear-oferta-academica.component';

describe('CrearOfertaAcademicaComponent', () => {
  let component: CrearOfertaAcademicaComponent;
  let fixture: ComponentFixture<CrearOfertaAcademicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearOfertaAcademicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearOfertaAcademicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
