import { TestBed } from '@angular/core/testing';

import { SelectfilialService } from './selectfilial.service';

describe('SelectfilialService', () => {
  let service: SelectfilialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectfilialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
