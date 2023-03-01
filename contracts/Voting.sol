// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Voting {
    address public owner;
    uint public startTimestamp;
    uint public endTimestamp;

    event VotingStarted(uint startTime, uint endTime);
    event VoterRegistered(address voter);
    event OptionRegistered(string name);
    event Voted(address voter, string option);

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        string votedOption;
    }

    mapping(address => Voter) public registeredVoters;
    mapping(string => uint) public votes;
    mapping(string => bool) public validOptions;
    string[] public optionList;

    constructor() {
        owner = msg.sender;
        
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier votingPeriod() {
        require(block.timestamp >= startTimestamp && block.timestamp <= endTimestamp, "Voting is not in progress.");
        _;
    }

    modifier outOfVotingPeriod() {
        console.log(startTimestamp);
        console.log( block.timestamp);
        require(startTimestamp == 0 || startTimestamp > block.timestamp, "Voting has already started");
        _;
    }

    function openVoting(uint _startTimestamp, uint _endTimestamp) public onlyOwner {
        require(_startTimestamp >= block.timestamp, "Start time must be in the future");
        require(_endTimestamp > _startTimestamp, "End time must be after start time");
        startTimestamp = _startTimestamp;
        endTimestamp = _endTimestamp;
        emit VotingStarted(startTimestamp, endTimestamp);
    }

    function registerVoter(address _voter) public onlyOwner outOfVotingPeriod {
        require(!registeredVoters[_voter].isRegistered, "The voter has already been registered.");
        registeredVoters[_voter].isRegistered = true;
        emit VoterRegistered(_voter);
    }

    function registerOption(string memory _option) public onlyOwner outOfVotingPeriod {
        require(!validOptions[_option], "Option has already registered");
        validOptions[_option] = true;
        optionList.push(_option);
        emit OptionRegistered(_option);
    }

    function castVote(string memory _option) public votingPeriod {
        require(registeredVoters[msg.sender].isRegistered, "You are not registered to vote");
        require(!registeredVoters[msg.sender].hasVoted, "You have already cast your vote");
        require(validOptions[_option], "Invalid option");
        registeredVoters[msg.sender].hasVoted = true;
        registeredVoters[msg.sender].votedOption = _option;
        votes[_option]++;
        emit Voted(msg.sender, _option);
    }

    function getVotes(string memory _option) public view returns (uint) {
        require(validOptions[_option], "Invalid option");
        return votes[_option];
    }

    function getOptions() public view returns (string[] memory) {
        return optionList;
    }
}