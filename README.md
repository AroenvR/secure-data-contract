Currently supported chains: Ganache server, MetisDAO, Binance Smart Chain

# What this template has:
```
Most of the code in this template is example solutions for problems you may encounter while creating / interacting with Smart Contracts

For example:
A basic Solidity object
A basic Solidity object's service
A basic Token
A basic Token's service

Tests for all of those
Tests for wallet balances

The tests contain examples of how a frontend could interact with SmartContracts.
```

## Setup

```
Check if you have yarn installed with: yarn --version
    If it is not installed: npm install --global yarn

(yarn init) <- not sure if necessary

yarn install
```

## .env.example

```
Set up your environment variables.
If you're running a Ganache server, grab a private key from there.
```

## Test

```
npm run test
If you're running a Ganache server: npx hardhat --network localhost test
```

## Deploy

```
ts-src/deploy
yarn hardhat --network [network-name] deploy
```

## Find it

```
The new SmartContract will be under deployments/[network-name]
```

## Verify

```
yarn hardhat --network [network-name] etherscan-verify
```

## Check your current progress
```
Note to self if life made me wait with continuing this project: 
cd smartcontract-deployer
npx hardhat test

Or if running a Ganache server:
npx hardhat --network localhost test

or to test a specific contract:

```