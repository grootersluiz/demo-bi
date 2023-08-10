import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListafornecedorComponent } from './listafornecedor.component';

describe('ListafornecedorComponent', () => {
  let component: ListafornecedorComponent;
  let fixture: ComponentFixture<ListafornecedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListafornecedorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListafornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
