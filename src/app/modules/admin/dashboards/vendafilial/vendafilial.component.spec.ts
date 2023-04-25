import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendafilialComponent } from './vendafilial.component';

describe('VendafilialComponent', () => {
  let component: VendafilialComponent;
  let fixture: ComponentFixture<VendafilialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendafilialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendafilialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
