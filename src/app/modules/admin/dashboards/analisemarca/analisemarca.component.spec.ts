import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalisemarcaComponent } from './analisemarca.component';

describe('VendafilialComponent', () => {
  let component: AnalisemarcaComponent;
  let fixture: ComponentFixture<AnalisemarcaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalisemarcaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalisemarcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
