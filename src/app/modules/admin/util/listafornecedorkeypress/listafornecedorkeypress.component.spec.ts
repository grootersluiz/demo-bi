import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListafornecedorkeypressComponent } from './listafornecedorkeypress.component';

describe('ListafornecedorkeypressComponent', () => {
  let component: ListafornecedorkeypressComponent;
  let fixture: ComponentFixture<ListafornecedorkeypressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListafornecedorkeypressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListafornecedorkeypressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
