import { TestBed } from '@angular/core/testing';

import { SavePatentService } from './save-patent.service';

describe('SavePatentService', () => {
  let service: SavePatentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SavePatentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
