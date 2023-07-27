import { TestBed } from '@angular/core/testing';

import { ListamarcaService } from './listamarca.service';

describe('ListamarcaService', () => {
  let service: ListamarcaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListamarcaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
