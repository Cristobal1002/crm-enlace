import { TestBed } from '@angular/core/testing';

import { GetUrlsService } from './get-urls.service';

describe('GetUrlsService', () => {
  let service: GetUrlsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetUrlsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
