import { ethers } from "ethers";

export async function getProviders(): Promise<ethers.providers.Web3Provider> {
    const ethereum = window.ethereum;
    if(ethereum.request) {
        await ethereum.request({ method: 'eth_requestAccounts' });
        return new ethers.providers.Web3Provider(window.ethereum);
    }else {
        throw Error('unable to connect on meta mask')
    }
}