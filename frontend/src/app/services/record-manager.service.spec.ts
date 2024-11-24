import { TestBed } from '@angular/core/testing';
import { RecordManager } from './record-manager.service';

describe('RecordManagerService', () => {
  let service: RecordManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecordManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
