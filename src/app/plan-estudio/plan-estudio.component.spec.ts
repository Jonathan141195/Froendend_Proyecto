import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanEstudioComponent } from './plan-estudio.component';

describe('PlanEtudioComponent', () => {
  let component: PlanEstudioComponent;
  let fixture: ComponentFixture<PlanEstudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanEstudioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanEstudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
