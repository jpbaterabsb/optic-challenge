# Vote System

## Goal
The goal of this application is to create decentralized vote system.

## 💻 Requirements

- Docker
- Docker Compose
- Node >=16
- Yarn

## 🚀 Install

1. Clone this repository

2. go to file hardhat.config.ts and change the following values:
```
%%YOUR_PRIVATE_KEY%% = Your ethereum private key
%%INFURA_API_KEY%% = api key infura (to get this value you will need to register on [Infura](https://www.infura.io/))
```

3. deploy voting contract running the following command:
```
yarn hardhat run scripts/deploy.ts --network goerli
```

When you run this command then you will some message like below message:

```
Vote contract was deployed succesfully 0xbf3fE3016aD373fFc0405e780399FC4E8d340Db2
```

The value in the end of the phrase will be your voting contract address. Copy this value because you will need of it to finish the set up.

3. go to file frontend/.env.docker and change the following values:
```
%%VOTING_CONTRACT_ADDRESS%% = the contract address of the contract which you have already deployed.
```

3. go to file backend/.env.docker and change the following values:
```
%%VOTING_CONTRACT_ADDRESS%% = the contract address of the contract which you have already deployed.
%%YOUR_PRIVATE_KEY%% = Your ethereum private key.
```

3. go to file backend/.env.docker and change the following values:
```
%%VOTING_CONTRACT_ADDRESS%% = the contract address of the contract which you have already deployed.
%%YOUR_PRIVATE_KEY%% = Your ethereum private key.
```

## ☕ Run the application

1. Run the below command in source folder of this repository:

```shell
yarn run-docker
```

## Notes

### Video Presentations:

If you wanna see the quick presentation access this [link](https://drive.google.com/file/d/1cR3A1eWytf661kOkjI0WUSurwHBgtt8u/view?usp=sharing).