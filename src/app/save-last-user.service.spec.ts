import { TestBed } from '@angular/core/testing';

import { SaveLastUserService } from './save-last-user.service';

describe('SaveLastUserService', () => {
  let service: SaveLastUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveLastUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
