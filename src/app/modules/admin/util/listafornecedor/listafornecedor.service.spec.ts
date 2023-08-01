import { TestBed } from '@angular/core/testing';

import { ListafornecedorService } from './listafornecedor.service';

describe('ListafornecedorService', () => {
  let service: ListafornecedorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListafornecedorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
