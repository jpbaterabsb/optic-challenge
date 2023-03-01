import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: `https://goerli.infura.io/v3/07d6c283a1084fa6a2c870990d73f7f5`,
      accounts: ['151e1c9548ebed70e3d4189bf9d7ece0ed28b35341d87f914ab25cef07a7bbb4']
    }
  }

};

export default config;
