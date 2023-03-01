import { EthersContract, EthersSigner } from 'nestjs-ethers';
import { PrismaService } from 'src/prisma.service';
import { abi } from 'src/abi/Voting.json';

export abstract class AbstractService {
  constructor(
    protected prisma: PrismaService,
    protected readonly ethersContract: EthersContract,
    protected readonly ethersSigner: EthersSigner,
  ) {}

  public getVotingContract() {
    const wallet = this.ethersSigner.createWallet(process.env.OWNER_PK);
    const votingContract = this.ethersContract.create(
      process.env.VOTING_ADDRESS,
      abi,
      wallet,
    );
    return votingContract;
  }
}
