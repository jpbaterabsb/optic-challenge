import { Contract } from '@ethersproject/contracts';
import { Test, TestingModule } from '@nestjs/testing';
import { VotingResult } from '@prisma/client';
import { EthersModule } from 'nestjs-ethers';
import { PrismaService } from 'src/prisma.service';
import { VotingResultService } from './voting-result.service';

describe('VotingResultService', () => {
  let service: VotingResultService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VotingResultService, PrismaService],
      imports: [EthersModule.forRoot()],
    }).compile();

    service = module.get<VotingResultService>(VotingResultService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerVotingResult', () => {
    it('should create a voting result', async () => {
      const votingResult: VotingResult = {
        option: 'A',
        name: 'Joao',
      };
      const spy = jest
        .spyOn(prismaService.votingResult, 'create')
        .mockResolvedValue(votingResult);

      const result = await service.registerVotingResult(votingResult);

      expect(spy).toHaveBeenCalledWith({ data: votingResult });
      expect(result).toEqual(votingResult);
    });
  });

  describe('listOptions', () => {
    it('should return sorted list of options and votes', async () => {
      const votingResults: VotingResult[] = [
        { option: 'A', name: 'Joao' },
        { option: 'B', name: 'Mari' },
        { option: 'C', name: 'Pedro' },
      ];
      const spy = jest
        .spyOn(prismaService.votingResult, 'findMany')
        .mockResolvedValue(votingResults);

      jest.spyOn(service, 'getVotingContract').mockImplementation(
        () =>
          ({
            votes: () => Promise.resolve({ toNumber: () => 6 }),
          } as any as Contract),
      );

      const result = await service.listOptions();

      expect(spy).toHaveBeenCalled();
      expect(result).toEqual([
        { option: 'A', name: 'Joao', votes: 6 },
        { option: 'B', name: 'Mari', votes: 6 },
        { option: 'C', name: 'Pedro', votes: 6 },
      ]);
    });
  });
});
