import { TestBed } from '@angular/core/testing';

import { ListacurvaService } from './listacurva.service';

describe('ListacurvaService', () => {
  let service: ListacurvaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListacurvaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
