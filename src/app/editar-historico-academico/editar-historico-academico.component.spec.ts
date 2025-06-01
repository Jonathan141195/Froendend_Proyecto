import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarHistoricoAcademicoComponent } from './editar-historico-academico.component';

describe('EditarHistoricoAcademicoComponent', () => {
  let component: EditarHistoricoAcademicoComponent;
  let fixture: ComponentFixture<EditarHistoricoAcademicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarHistoricoAcademicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarHistoricoAcademicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
