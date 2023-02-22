import { ethers } from "hardhat";

async function main() {
  const Vote = await ethers.getContractFactory("Vote");
  const vote = await Vote.deploy();

  await vote.deployed();

  console.log(`Vote contract was deployed succesfully`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
