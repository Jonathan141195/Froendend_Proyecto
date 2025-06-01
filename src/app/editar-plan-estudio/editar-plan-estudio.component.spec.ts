import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPlanEstudioComponent } from './editar-plan-estudio.component';

describe('EditarPlanEstudioComponent', () => {
  let component: EditarPlanEstudioComponent;
  let fixture: ComponentFixture<EditarPlanEstudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarPlanEstudioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarPlanEstudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
