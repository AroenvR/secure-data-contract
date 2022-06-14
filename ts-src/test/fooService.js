// import { expect } from 'chai';
// import { ethers } from "hardhat";
const { expect } = require("chai");
const { ethers } = require("hardhat");

// cd personal-hardhat-template
// npx hardhat test

let contract;
let transaction;
let contractAddress;
let contractFunctions;

let user1;
let user1Address;
let user2;
let user2Address;
let user3;
let user3Address;

beforeEach(async () => {
  [user1, user2, user3] = await ethers.getSigners(); // is an an array of wallet objects.
  user1Address = await user1.getAddress();
  user2Address = await user2.getAddress();
  user3Address = await user3.getAddress();

  const FooService = await ethers.getContractFactory("FooService");
  contract = await FooService.deploy();

  contractAddress = contract.address;
  transaction = contract.deployTransaction;

  const successfullDeploy = await contract.deployed();
  contractFunctions = successfullDeploy.functions;

  expect(transaction).to.exist;
});

// TODO: Check if I need any afterEeach() functions.

describe("beforeEach successfully deployed the contract, the contract:", function () {

  it("greets us", async function () {
    expect(await contract.getGreeting()).to.be.equal("Hi! You've successfully connected to the FenService contract!");
  });

  //--------------------------------------------------------------------------------------------------------------------

  it("asserts the message senders", async function () {
    // Sending a message to the SmartContract with white's wallet.
    let initialMsgSender = await contract.getMsgSender();
    expect(user1Address).to.be.equal(initialMsgSender);

    // Changing the wallet with which we connect to the SmartContract with.
    const contractAsBlack = contract.connect(user2);

    // Sending a message to the SmartContract with black's wallet.
    let changedMsgSender = await contractAsBlack.getMsgSender();
    expect(user2Address).to.be.equal(changedMsgSender);
  });

  //--------------------------------------------------------------------------------------------------------------------

  // TODO it creates a new fenboard and returns the current fenboard id. Do I need an ID? Might make searching arrays easier -> some hash of the two addresses could be the ID?

  it("creates a new Foo and receives a successful transaction", async function () {
    const transaction = await contract.createFoo();
    await transaction.wait();

    expect(transaction.data).to.exist;
  });

  //--------------------------------------------------------------------------------------------------------------------

  it("asserts the Foo's creating address is the FooService contract's address", async function () {
    const transaction = await contract.createFoo();
    await transaction.wait();

    const boardCreator = await contract.getFoosCreator();

    expect(boardCreator).to.be.equal(contractAddress);
  });

  //--------------------------------------------------------------------------------------------------------------------

  it("accepts donations", async function () {
    const initialContractBalance = await contract.getTotalBalance();
    expect(initialContractBalance).to.be.equal(0);

    // Sends exactly 1.0 ether to the contract.
    const transactionHash = await user1.sendTransaction({
      to: contractAddress,
      value: ethers.utils.parseEther("1.0"), 
    });

    const newBalance = await contract.getTotalBalance();
    expect(newBalance).to.be.equal(ethers.utils.parseEther("1.0"));
  });

  //--------------------------------------------------------------------------------------------------------------------

  it("accepts donations separated by different addresses", async function () {
    let contractBalance = await contract.getTotalBalance();
    expect(contractBalance).to.be.equal(0);

    // Sends exactly 1.0 ether to the contract as white.
    const transactionHash = await user1.sendTransaction({
      to: contractAddress,
      value: ethers.utils.parseEther("1.0"), 
    });

    contractBalance = await contract.getTotalBalance();
    expect(contractBalance).to.be.equal(ethers.utils.parseEther("1.0"));

    // Sends exactly 1.0 ether to the contract as black.
    const transactionHash2 = await user2.sendTransaction({
      to: contractAddress,
      value: ethers.utils.parseEther("1.5"), 
    });

    // Asserts the total balance is equal to both donations.
    contractBalance = await contract.getTotalBalance();
    expect(contractBalance).to.be.equal(ethers.utils.parseEther("2.5"));

    // Asserts that white and black have separate balances.
    const balanceOfWhite = await contract.getMyBalance();
    expect(balanceOfWhite).to.be.equal(ethers.utils.parseEther("1.0"));

    const contractAsBlack = contract.connect(user2);
    const balanceOfBlack = await contractAsBlack.getMyBalance();
    expect(balanceOfBlack).to.be.equal(ethers.utils.parseEther("1.5"));
  });

  //--------------------------------------------------------------------------------------------------------------------

  it("only allows correct withdrawals", async function () {
    let contractBalance = await contract.getTotalBalance();
    expect(contractBalance).to.be.equal(0);

    // Sends exactly 1.0 ether to the contract as white.
    const transactionHash = await user1.sendTransaction({
      to: contractAddress,
      value: ethers.utils.parseEther("1.0"), 
    });

    // Sends exactly 1.5 ether to the contract as black.
    const transactionHash2 = await user2.sendTransaction({
      to: contractAddress,
      value: ethers.utils.parseEther("1.5"), 
    });

    // Asserts the contract's total balance.
    contractBalance = await contract.getTotalBalance();
    expect(contractBalance).to.be.equal(ethers.utils.parseEther("2.5"));
    
    // Withdraw 1.0 ether from the contract.
    await contract.withdraw(ethers.utils.parseEther("1.0"));

    contractBalance = await contract.getTotalBalance();
    expect(contractBalance).to.be.equal(ethers.utils.parseEther("1.5"));
    
    // Assert that users can only withdraw equal to or less than they have donated.
    const contractAsSpectator = contract.connect(user3);
    expect(contractAsSpectator.withdraw(ethers.utils.parseEther("1.0"))).to.be.reverted;
  });
  
});
