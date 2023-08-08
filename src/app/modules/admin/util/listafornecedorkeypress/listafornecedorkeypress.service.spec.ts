import { TestBed } from '@angular/core/testing';

import { ListafornecedorkeypressService } from './listafornecedorkeypress.service';

describe('ListafornecedorkeypressService', () => {
  let service: ListafornecedorkeypressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListafornecedorkeypressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
