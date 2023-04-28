import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendafilialchartComponent } from './vendafilialchart.component';

describe('VendafilialchartComponent', () => {
  let component: VendafilialchartComponent;
  let fixture: ComponentFixture<VendafilialchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendafilialchartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendafilialchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
