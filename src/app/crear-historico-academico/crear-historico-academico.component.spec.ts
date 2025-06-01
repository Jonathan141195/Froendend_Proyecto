import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearHistoricoAcademicoComponent } from './crear-historico-academico.component';

describe('CrearHistoricoAcademicoComponent', () => {
  let component: CrearHistoricoAcademicoComponent;
  let fixture: ComponentFixture<CrearHistoricoAcademicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearHistoricoAcademicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearHistoricoAcademicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
