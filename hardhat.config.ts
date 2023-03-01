import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: `https://goerli.infura.io/v3/%%INFURA_API_KEY%%`,
      accounts: ['%%YOUR_PRIVATE_KEY%%']
    }
  }

};

export default config;
