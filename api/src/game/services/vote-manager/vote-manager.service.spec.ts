import { Test, TestingModule } from '@nestjs/testing';
import { VoteManagerService } from './vote-manager.service';

describe('VoteManagerService', () => {
  let service: VoteManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VoteManagerService],
    }).compile();

    service = module.get<VoteManagerService>(VoteManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
