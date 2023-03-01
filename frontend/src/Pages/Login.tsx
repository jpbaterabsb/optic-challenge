import { Box } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { ethers } from 'ethers';
import { AuthenticateButton } from '../Components/AuthenticateButton';
import { useRecoilState } from 'recoil';
import { accountState } from '../Atoms/providerState';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Navbar } from '../Components/Navbar';

export const Login: React.FC = () => {
  const [accountAddress, setAccountAddress] = useRecoilState(accountState);
  const navigate = useNavigate();

  const connectToMetaMask = async () => {
    try {
      const ethereum = window.ethereum;
      if (ethereum.request) {
        await ethereum.request({ method: 'eth_requestAccounts' });
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);

        const account = await web3Provider.getSigner();
        if (account) {
          setAccountAddress(await account.getAddress());
        }
      }
    } catch (err) {
      console.error(err);
      toast('Failed to connect to MetaMask');
    }
  };

  useEffect(() => {
    async function onInit() {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();

        if (window.ethereum.request && network.chainId !== 5) {
          // Switch to the Goerli network
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x5",
                chainName: "Goerli Test Network",
                nativeCurrency: {
                  name: "Ether",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: ["https://rpc.goerli.mudit.blog/"],
                blockExplorerUrls: ["https://goerli.etherscan.io/"],
              },
            ],
          });

          if (accountAddress) {
            navigate('/');
          }

        }
      }
    }

    onInit();
  }, [accountAddress, setAccountAddress, navigate]);

  return <>
    <Navbar title='Login' />
    <Box minH='100vh' display={'flex'} flex={1} justifyContent='center' alignItems='center' >
      <AuthenticateButton onClick={connectToMetaMask} />
    </Box>
  </>;

}