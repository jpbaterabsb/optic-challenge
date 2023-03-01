import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: `https://goerli.infura.io/v3/07d6c283a1084fa6a2c870990d73f7f5`,
      accounts: ['869d66d3ddb5ea3cfab803480146ba2c3c01731460ddd24e7154f01fabe3ef8e']
    }
  }

};

export default config;
