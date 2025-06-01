import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCantonComponent } from './crear-canton.component';

describe('CrearCantonComponent', () => {
  let component: CrearCantonComponent;
  let fixture: ComponentFixture<CrearCantonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearCantonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearCantonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
