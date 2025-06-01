import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearMateriaComponent } from './crear-materia.component';

describe('CrearMateriaComponent', () => {
  let component: CrearMateriaComponent;
  let fixture: ComponentFixture<CrearMateriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearMateriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearMateriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
