import { Injectable } from '@nestjs/common';
import { Voter } from '@prisma/client';
import {
  EthersContract,
  EthersSigner,
  InjectContractProvider,
  InjectSignerProvider,
} from 'nestjs-ethers';
import { AbstractService } from 'src/abstract.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class VoterService extends AbstractService {
  constructor(
    prisma: PrismaService,
    @InjectContractProvider()
    ethersContract: EthersContract,
    @InjectSignerProvider()
    ethersSigner: EthersSigner,
  ) {
    super(prisma, ethersContract, ethersSigner);
  }

  async registerVoter(voter: Voter) {
    return this.upsertVoter(voter);
  }

  async listVoters() {
    const voters = await this.prisma.voter.findMany();
    const votingContract = this.getVotingContract();
    const reponse = await Promise.all(
      voters.map(async (v) => {
        const { hasVoted, votedOption } = await votingContract.registeredVoters(
          v.address,
        );
        return { ...v, ...{ hasVoted, votedOption } };
      }),
    );
    return reponse;
  }

  async upsertVoter(voter: Voter) {
    voter.dateOfBirth = new Date(voter.dateOfBirth);
    const pVoter = await this.prisma.voter.upsert({
      where: {
        address: voter.address,
      },
      create: voter,
      update: voter,
    });
    return pVoter;
  }
}
