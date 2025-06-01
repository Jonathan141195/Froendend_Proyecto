import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarOfertaAcademicaComponent } from './editar-oferta-academica.component';

describe('EditarOfertaAcademicaComponent', () => {
  let component: EditarOfertaAcademicaComponent;
  let fixture: ComponentFixture<EditarOfertaAcademicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarOfertaAcademicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarOfertaAcademicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
