import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearDistritoComponent } from './crear-distrito.component';

describe('CrearDistritoComponent', () => {
  let component: CrearDistritoComponent;
  let fixture: ComponentFixture<CrearDistritoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearDistritoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearDistritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
