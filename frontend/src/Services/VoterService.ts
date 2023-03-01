import { rest } from "../Configurations/rest";
import { Voter } from "../Models/Voter";
import Voting from "../Contracts/Voting.sol/Voting.json";
import { ethers } from "ethers";
import { getProviders } from "../Configurations/ethers";

export async function registerVoterBackend(voter: Voter) {
    return rest.post('/voters', voter);
}


export async function listVoters() {
    return rest.get('/voters');
}

export async function registerVoter(voter: Voter) {
    const contract = await getVotingContract();
    const tx = await contract.registerVoter(voter.address);
    await tx.wait();
    voter.txHash = tx.hash
    await registerVoterBackend(voter);
    return;
}

export async function registerOption(option: {name: string, code: string}) {
    const contract = await getVotingContract();
    const tx = await contract.registerOption(option.code);
    await tx.wait();
}

export async function startVoting(startDate: Date, endDate: Date) {
    const contract = await getVotingContract();
    const tx = await contract.openVoting(toSolidityTimestamp(startDate), toSolidityTimestamp(endDate));
    return tx.wait();
}

export async function castVote(option: string) {
    const contract = await getVotingContract();
    return contract.castVote(option);
}


export async function getVotingPeriod() {
    const contract = await getVotingContract();
    const startTimestamp =  (await contract.startTimestamp()).toNumber();
    const endTimestamp =  (await contract.endTimestamp()).toNumber();
    const response = {startTimestamp: fromSolidityTimestamp(startTimestamp),  endTimestamp: fromSolidityTimestamp(endTimestamp), hasStarted: false};
    if(response.startTimestamp && new Date() > response.startTimestamp) {
        response.hasStarted = true;
    }
    return response;
}

function fromSolidityTimestamp(timestamp: number) {
    if(timestamp === 0) {
        return null;
    }
    return new Date(timestamp * 1000);
}

function toSolidityTimestamp(date: Date) {
    return new Date(date).getTime() / 1000;
}


async function getVotingContract() {
    const provider = await getProviders();
    const contract = new ethers.Contract(process.env.REACT_APP_VOTING_ADDRESS || '', Voting.abi, provider.getSigner());
    return contract;
}