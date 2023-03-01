import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { accountState } from '../Atoms/providerState';
import { votingPeriodState } from '../Atoms/votingPeriodState';
import { getVotingPeriod } from '../Services/VoterService';
import { ethers } from 'ethers';

type Props = {
  target: React.ReactNode;
};

export const Authenticator: React.FC<Props> = ({ target }) => {
  const navigate = useNavigate();
  const [account] = useRecoilState(accountState);
  const [votingPeriod, setVotingPeriod] = useRecoilState(votingPeriodState);


  useEffect(() => {
    async function onInit() {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();

        if (window.ethereum.request && network.chainId !== 5) {
          // Switch to the Goerli network
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{
              chainId: "0x5"
            }]
          })
        }
      }
    }
    onInit();
  }, []);

  useEffect(() => {
    if (!account) {
      navigate('/login');
    }


    async function checkIfVotingHasStarted() {
      if (!votingPeriod.startTimestamp) {
        const { startTimestamp, endTimestamp } = await getVotingPeriod();
        
        if (startTimestamp) {
          setVotingPeriod({ startTimestamp, endTimestamp })
        }
      } else if (votingPeriod.endTimestamp && votingPeriod.endTimestamp < new Date()) {
        navigate('/voting-results');
      }
      else if (votingPeriod.startTimestamp <= new Date() && votingPeriod.endTimestamp && votingPeriod.endTimestamp >= new Date()) {
        navigate('/voting');
      }
    }

    checkIfVotingHasStarted();


  }, [account, navigate, setVotingPeriod, votingPeriod]);
  return <>{target}</>;
}