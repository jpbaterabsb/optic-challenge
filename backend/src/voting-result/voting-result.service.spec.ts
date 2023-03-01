import { Test, TestingModule } from '@nestjs/testing';
import { VotingResultService } from './voting-result.service';

describe('VotingResultService', () => {
  let service: VotingResultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VotingResultService],
    }).compile();

    service = module.get<VotingResultService>(VotingResultService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
