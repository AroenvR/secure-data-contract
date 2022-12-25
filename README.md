Starting code taken from my personal-hardhat-template: https://github.com/AroenvR/personal-hardhat-template.git

# What this project is about:
The contracts in this project are dedicated to solving the issue of storing sensitive data on a public ledger.  
The DataStore contract can read & write cipherTexts.  
The DataStoreService contract is for users to anonymously interact with their own DataStore.  

## Setup

```
In another terminal start your ganache server with: ganache

npm i
npx hardhat --network localhost test
```

## Deploy

```
ts-src/deploy
yarn hardhat --network [network-name] deploy
// npx? Need to test.
```

## Find it

```
The new SmartContract will be under deployments/[network-name]
```

## Check your current progress
```
Note to self if life made me wait with continuing this project:  

cd secure-data-contract  
npx hardhat test

If running a Ganache server:  
npx hardhat --network localhost test

or to test a specific contract (with a Ganache server):  
npx hardhat --network localhost test ./ts-src/test/dataStoreService.js
```