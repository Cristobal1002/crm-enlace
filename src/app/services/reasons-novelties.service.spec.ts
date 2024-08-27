import { TestBed } from '@angular/core/testing';

import { ReasonsNoveltiesService } from './reasons-novelties.service';

describe('ReasonsNoveltiesService', () => {
  let service: ReasonsNoveltiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReasonsNoveltiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
