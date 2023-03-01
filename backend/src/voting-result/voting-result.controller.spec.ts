import { Test, TestingModule } from '@nestjs/testing';
import { VotingResultController } from './voting-result.controller';

describe('VotingResultController', () => {
  let controller: VotingResultController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VotingResultController],
    }).compile();

    controller = module.get<VotingResultController>(VotingResultController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
