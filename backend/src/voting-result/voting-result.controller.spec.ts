import { Test, TestingModule } from '@nestjs/testing';
import { VotingResult } from '@prisma/client';
import { VotingResultController } from './voting-result.controller';
import { VotingResultRequest } from './voting-result.request';
import { VotingResultService } from './voting-result.service';

describe('VotingResultController', () => {
  let controller: VotingResultController;
  let service: VotingResultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VotingResultController],
      providers: [
        {
          provide: VotingResultService,
          useValue: {
            registerVotingResult: jest.fn(() => Promise.resolve({ id: 1 })),
            listOptions: jest.fn(() =>
              Promise.resolve([
                { option: 'option1', voter: 'voter1', votes: 1 },
                { option: 'option2', voter: 'voter2', votes: 1 },
              ]),
            ),
          },
        },
      ],
    }).compile();

    controller = module.get<VotingResultController>(VotingResultController);
    service = module.get<VotingResultService>(VotingResultService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('register', () => {
    it('should register a voting result and return the created result', async () => {
      const request: VotingResultRequest = {
        option: 'option1',
        name: 'voter1',
      };
      const createdResult: VotingResult = {
        option: 'option1',
        name: 'voter1',
      };
      jest
        .spyOn(service, 'registerVotingResult')
        .mockResolvedValue(createdResult);

      const result = await controller.register(request);

      expect(service.registerVotingResult).toHaveBeenCalledWith(request);
      expect(result).toEqual(createdResult);
    });
  });

  describe('getAllVoters', () => {
    it('should return all voting results with their votes', async () => {
      const expectedResult = [
        { option: 'option1', voter: 'voter1', votes: 1 },
        { option: 'option2', voter: 'voter2', votes: 1 },
      ];
      jest.spyOn(service, 'listOptions').mockResolvedValue(expectedResult);

      const result = await controller.getAllVoters();

      expect(service.listOptions).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });
});
