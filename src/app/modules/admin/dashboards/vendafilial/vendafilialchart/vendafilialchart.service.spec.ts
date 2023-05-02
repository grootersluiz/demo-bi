import { TestBed } from '@angular/core/testing';

import { VendafilialchartService } from './vendafilialchart.service';

describe('VendafilialchartService', () => {
  let service: VendafilialchartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VendafilialchartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
