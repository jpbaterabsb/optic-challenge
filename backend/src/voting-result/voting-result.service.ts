import { Injectable } from '@nestjs/common';
import { VotingResult } from '@prisma/client';
import {
  EthersContract,
  EthersSigner,
  InjectContractProvider,
  InjectSignerProvider,
} from 'nestjs-ethers';
import { AbstractService } from 'src/abstract.service';
import { PrismaService } from 'src/prisma.service';
import { VotingResultResponse } from './voting-result.response';

@Injectable()
export class VotingResultService extends AbstractService {
  constructor(
    prisma: PrismaService,
    @InjectContractProvider()
    ethersContract: EthersContract,
    @InjectSignerProvider()
    ethersSigner: EthersSigner,
  ) {
    super(prisma, ethersContract, ethersSigner);
  }

  async registerVotingResult(votingResult: VotingResult) {
    return this.createVotingResult(votingResult);
  }

  private createVotingResult(votingResult: VotingResult) {
    return this.prisma.votingResult.create({
      data: votingResult,
    });
  }

  async listOptions(): Promise<VotingResultResponse[]> {
    const votingResults = await this.prisma.votingResult.findMany();
    const votingContract = this.getVotingContract();
    const reponse = await Promise.all(
      votingResults.map(async (v) => {
        const votes = await votingContract.votes(v.option);
        return { ...v, votes: votes.toNumber() };
      }),
    );

    reponse.sort((a, b) => b.votes - a.votes);
    return reponse;
  }
}
