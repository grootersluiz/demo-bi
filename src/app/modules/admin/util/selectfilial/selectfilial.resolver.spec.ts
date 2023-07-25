import { TestBed } from '@angular/core/testing';

import { SelectfilialResolver } from './selectfilial.resolver';

describe('SelectfilialResolver', () => {
  let resolver: SelectfilialResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(SelectfilialResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
