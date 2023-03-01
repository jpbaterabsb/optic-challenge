import { Module } from '@nestjs/common';
import { EthersModule, GOERLI_NETWORK } from 'nestjs-ethers';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { VoterController } from './voter/voter.controller';
import { VoterService } from './voter/voter.service';
import { VotingResultService } from './voting-result/voting-result.service';
import { VotingResultController } from './voting-result/voting-result.controller';

@Module({
  imports: [
    EthersModule.forRoot({
      network: GOERLI_NETWORK,
      infura: {
        projectId: '07d6c283a1084fa6a2c870990d73f7f5',
      },
      useDefaultProvider: false,
    }),
  ],

  controllers: [VoterController, VotingResultController],
  providers: [AppService, VoterService, PrismaService, VotingResultService],
})
export class AppModule {}
