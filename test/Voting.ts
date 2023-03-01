import { ethers } from "hardhat";
import { Signer, Contract, ContractFactory } from "ethers";
import { expect } from "chai";

describe("Voting", function () {
  let owner: Signer;
  let voter: Signer;
  let contract: Contract;

  beforeEach(async function () {
    [owner, voter] = await ethers.getSigners();

    const Voting: ContractFactory = await ethers.getContractFactory("Voting");
    contract = await Voting.deploy();
    await contract.deployed();
  });

  describe("openVoting", function () {
    it("should allow owner to open voting", async function () {
      const currentBlockTime = (await ethers.provider.getBlock("latest")).timestamp;
      const startTimestamp = currentBlockTime + 1000;
      const endTimestamp = currentBlockTime + 2000;

      await contract.openVoting(startTimestamp, endTimestamp);

      const votingStartTimestamp = await contract.startTimestamp();
      const votingEndTimestamp = await contract.endTimestamp();
      expect(votingStartTimestamp).to.equal(startTimestamp);
      expect(votingEndTimestamp).to.equal(endTimestamp);
    });

    it("should prevent non-owner from opening voting", async function () {
      const currentBlockTime = (await ethers.provider.getBlock("latest")).timestamp;
      const startTimestamp = currentBlockTime + 1000;
      const endTimestamp = currentBlockTime + 2000;

      await expect(contract.connect(voter).openVoting(startTimestamp, endTimestamp)).to.be.revertedWith("Only owner can perform this action");
    });

    it("should prevent opening voting with invalid timestamps", async function () {
      const currentBlockTime = (await ethers.provider.getBlock("latest")).timestamp;
      const startTimestamp = currentBlockTime + 1000;
      const endTimestamp = currentBlockTime + 500;

      await expect(contract.openVoting(startTimestamp, endTimestamp)).to.be.revertedWith("End time must be after start time");

      const pastTimestamp = currentBlockTime - 1000;

      await expect(contract.openVoting(pastTimestamp, startTimestamp)).to.be.revertedWith("Start time must be in the future");
    });
  });

  describe("registerVoter", function () {
    it("should allow owner to register voters", async function () {
      await contract.registerVoter(await voter.getAddress());

      const voterData = await contract.registeredVoters(await voter.getAddress());
      expect(voterData.isRegistered).to.equal(true);
    });

    it("shouldn't allow owner the same voter 2 times", async function () {
      await contract.registerVoter(await voter.getAddress());
      const voterData = await contract.registeredVoters(await voter.getAddress());
      expect(voterData.isRegistered).to.equal(true);
      await expect(contract.registerVoter(await voter.getAddress())).to.be.revertedWith("The voter has already been registered.");
    });

    it("should prevent non-owner from registering voters", async function () {
      await expect(contract.connect(voter).registerVoter(await voter.getAddress())).to.be.revertedWith("Only owner can perform this action");
    });

    it("should prevent registering voters during voting period", async function () {
      const currentBlockTime = (await ethers.provider.getBlock("latest")).timestamp;
      const startTimestamp = currentBlockTime + 2;
      const endTimestamp = currentBlockTime + 6000;
      await contract.openVoting(startTimestamp, endTimestamp);

      await expect(contract.registerVoter(await voter.getAddress())).to.be.revertedWith("Voting has already started");
    });
  });

  describe("registerOption", function () {
    it("should allow owner to register options", async function () {
      const optionName = "Option 1";

      await contract.registerOption(optionName);

      const optionRegistered = await contract.validOptions(optionName);
      const optionList = await contract.optionList(0);

      expect(optionRegistered).to.equal(true);
      expect(optionList).to.equal(optionName);
    });

    it("should prevent non-owner from registering options", async function () {
      const optionName = "Option 1";
      await expect(contract.connect(voter).registerOption(optionName)).to.be.revertedWith("Only owner can perform this action");
    });

    it("should prevent registering options during voting period", async function () {
      const optionName = "Option 1";
      const currentBlockTime = (await ethers.provider.getBlock("latest")).timestamp;
      const startTimestamp = currentBlockTime + 2;
      const endTimestamp = currentBlockTime + 2000;

      await contract.openVoting(startTimestamp, endTimestamp);

      await expect(contract.registerOption(optionName)).to.be.revertedWith("Voting has already started");
    });
  });

  describe("castVote", function () {

    let currentBlockTime: number;
    let startTimestamp: number;
    let endTimestamp: number;
    beforeEach(async function () {
      currentBlockTime = (await ethers.provider.getBlock("latest")).timestamp;
      startTimestamp = currentBlockTime + 1000;
      endTimestamp = currentBlockTime + 2000;
    });

    it("should prevent unregistered voter from casting vote", async function () {
      const optionName = "Option 1";
      await contract.openVoting(startTimestamp, endTimestamp);
      await ethers.provider.send("evm_mine", [currentBlockTime + 1100]);
      await expect(contract.connect(voter).castVote(optionName)).to.be.revertedWith("You are not registered to vote");
    });

    it("should prevent casting vote for unregistered option", async function () {
      const invalidOption = "Invalid Option";
      await contract.registerVoter(await voter.getAddress());
      await contract.openVoting(startTimestamp, endTimestamp);
      await ethers.provider.send("evm_mine", [currentBlockTime + 1100]);
      await expect(contract.connect(voter).castVote(invalidOption)).to.be.revertedWith("Invalid option");
    });

    it("should prevent casting vote before voting starts", async function () {
      const optionName = "Option 1";

      await contract.registerOption(optionName);
      await contract.registerVoter(await voter.getAddress());
      await contract.openVoting(startTimestamp, endTimestamp);
      await expect(contract.castVote(optionName)).to.be.revertedWith("Voting is not in progress.");
    });

    it("should prevent casting vote after voting ends", async function () {
      const optionName = "Option 1";

      await contract.registerOption(optionName);
      await contract.registerVoter(await voter.getAddress());
      await contract.openVoting(startTimestamp, endTimestamp);

      await ethers.provider.send("evm_mine", [endTimestamp + 1]);

      await expect(contract.connect(voter).castVote(optionName)).to.be.revertedWith("Voting is not in progress.");
    });

    it("should prevent double voting", async function () {
      const optionName = "Option 1";

      await contract.registerOption(optionName);
      await contract.registerVoter(await voter.getAddress());
      await contract.openVoting(startTimestamp, endTimestamp);
      await ethers.provider.send("evm_mine", [currentBlockTime + 1100]);
      await contract.connect(voter).castVote(optionName);
      await expect(contract.connect(voter).castVote(optionName)).to.be.revertedWith("You have already cast your vote");
    });

    it("should return correct option names", async function () {
      const optionName1 = "Option 1";
      const optionName2 = "Option 2";
      await contract.registerOption(optionName1);
      await contract.registerOption(optionName2);
      await contract.openVoting(startTimestamp, endTimestamp);

      const options = await contract.getOptions();
      expect(options.length).to.equal(2);
      expect(options[0]).to.equal(optionName1);
      expect(options[1]).to.equal(optionName2);
    });

    it("should return correct vote count for an option", async function () {
      const optionName = "Option 1";  
      await contract.registerOption(optionName);
      await contract.registerVoter(await voter.getAddress());
      await contract.openVoting(startTimestamp, endTimestamp);
      await ethers.provider.send("evm_mine", [currentBlockTime + 1100]);
      await contract.connect(voter).castVote(optionName);
      const voteCount = await contract.getVotes(optionName);
      expect(voteCount).to.equal(1);
    });

  });

});
