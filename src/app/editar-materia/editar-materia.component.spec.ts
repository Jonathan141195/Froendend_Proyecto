import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarMateriaComponent } from './editar-materia.component';

describe('EditarMateriaComponent', () => {
  let component: EditarMateriaComponent;
  let fixture: ComponentFixture<EditarMateriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarMateriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarMateriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
