import { Test, TestingModule } from '@nestjs/testing';
import { VoterService } from './voter.service';
import { PrismaService } from '../prisma.service';
import { Voter } from '@prisma/client';
import { Contract } from '@ethersproject/contracts';
import { EthersModule } from 'nestjs-ethers';

describe('VoterService', () => {
  let voterService: VoterService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [VoterService, PrismaService],
      imports: [EthersModule.forRoot()],
    }).compile();

    voterService = moduleRef.get<VoterService>(VoterService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('registerVoter', () => {
    it('should upsert the given voter', async () => {
      const mockVoter: Voter = {
        address: '0x123',
        email: 'alice@example.com',
        dateOfBirth: new Date('2000-01-01'),
        txHash: null,
      };
      const upsertSpy = jest
        .spyOn(prismaService.voter, 'upsert')
        .mockResolvedValueOnce(mockVoter);

      const result = await voterService.registerVoter(mockVoter);

      expect(upsertSpy).toHaveBeenCalledWith({
        where: { address: mockVoter.address },
        create: mockVoter,
        update: mockVoter,
      });
      expect(result).toEqual(mockVoter);
    });
  });

  describe('listVoters', () => {
    it('should return a list of voters with additional voting information', async () => {
      const mockVoters: Voter[] = [
        {
          address: '0x123',
          email: 'alice@example.com',

          dateOfBirth: new Date('2000-01-01'),

          txHash: '',
        },
        {
          address: '0x456',
          email: 'bob@example.com',
          dateOfBirth: new Date('2000-02-01'),

          txHash: '',
        },
      ];
      const mockRegisteredVoters = jest.fn(() => ({
        hasVoted: false,
        votedOption: '',
      }));
      const mockFindMany = jest
        .spyOn(prismaService.voter, 'findMany')
        .mockResolvedValueOnce(mockVoters);
      const mockGetVotingContract = jest
        .spyOn(voterService, 'getVotingContract')
        .mockReturnValueOnce({
          registeredVoters: mockRegisteredVoters,
        } as any as Contract);

      const result = await voterService.listVoters();

      expect(mockFindMany).toHaveBeenCalled();
      expect(mockGetVotingContract).toHaveBeenCalled();
      expect(mockRegisteredVoters).toHaveBeenCalledWith('0x123');
      expect(mockRegisteredVoters).toHaveBeenCalledWith('0x456');
      expect(result).toEqual([
        { ...mockVoters[0], hasVoted: false, votedOption: '' },
        { ...mockVoters[1], hasVoted: false, votedOption: '' },
      ]);
    });
  });

  describe('upsertVoter', () => {
    it('should upsert the given voter', async () => {
      const mockVoter: Voter = {
        address: '0x123',
        email: 'alice@example.com',
        dateOfBirth: new Date('2000-01-01'),
        txHash: null,
      };
      const upsertSpy = jest
        .spyOn(prismaService.voter, 'upsert')
        .mockResolvedValueOnce(mockVoter);

      const result = await voterService.upsertVoter(mockVoter);

      expect(upsertSpy).toHaveBeenCalledWith({
        where: { address: mockVoter.address },
        create: mockVoter,
        update: mockVoter,
      });
      expect(result).toEqual(mockVoter);
    });
  });
});
