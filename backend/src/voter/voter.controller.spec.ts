import { Test, TestingModule } from '@nestjs/testing';
import { EthersModule } from 'nestjs-ethers';
import { PrismaService } from 'src/prisma.service';
import { VoterController } from './voter.controller';
import { VoterService } from './voter.service';

describe('VoterController', () => {
  let controller: VoterController;
  let service: VoterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoterController],
      providers: [VoterService, PrismaService],
      imports: [EthersModule.forRoot()],
    }).compile();

    controller = module.get<VoterController>(VoterController);
    service = module.get<VoterService>(VoterService);
  });

  describe('register', () => {
    it('should register a new voter', async () => {
      const mockVoter = {
        address: '0x123',
        email: 'alice@example.com',
        dateOfBirth: new Date('2000-01-01'),
        txHash: null,
        error: null,
      };

      jest.spyOn(service, 'registerVoter').mockResolvedValueOnce(mockVoter);

      const result = await controller.register(mockVoter);

      expect(service.registerVoter).toHaveBeenCalledWith(mockVoter);
      expect(result).toEqual(mockVoter);
    });
  });

  describe('getAllVoters', () => {
    it('should return a list of voters', async () => {
      const mockVoters = [
        {
          address: '0x123',
          email: 'alice@example.com',
          dateOfBirth: new Date('2000-01-01'),
          hasVoted: false,
          votedOption: '',
          txHash: null,
          error: null,
        },
        {
          address: '0x456',
          email: 'bob@example.com',
          dateOfBirth: new Date('2000-02-01'),
          hasVoted: true,
          votedOption: 'A',
          txHash: null,
          error: null,
        },
      ];
      jest.spyOn(service, 'listVoters').mockResolvedValueOnce(mockVoters);

      const result = await controller.getAllVoters();

      expect(service.listVoters).toHaveBeenCalled();
      expect(result).toEqual(mockVoters);
    });
  });
});
