
import { rest } from "../Configurations/rest";
import {  Option } from "../Models/VotingResult";
import Voting from "../Contracts/Voting.sol/Voting.json";
import { ethers } from "ethers";
import { getProviders } from "../Configurations/ethers";

export async function registerVotingResultBackend(option: Option) {
    return rest.post('/voting-results', option);
}


export async function listVotingResults() {
    return rest.get('/voting-results');
}

export async function getVoteData() {
    const provider = await getProviders();
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const contract = await getVotingContract();
    return await contract.registeredVoters(address);
}


export async function registerOption(option: Option) {
    const contract = await getVotingContract();
    const tx = await contract.registerOption(option.option);
    await tx.wait();
    return registerVotingResultBackend(option);
}

async function getVotingContract() {
    const provider = await getProviders();
    const contract = new ethers.Contract(process.env.REACT_APP_VOTING_ADDRESS || '', Voting.abi, provider.getSigner());
    return contract;
}