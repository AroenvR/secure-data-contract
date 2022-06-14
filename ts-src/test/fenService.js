// import { expect } from 'chai';
// import { ethers } from "hardhat";
const { expect } = require("chai");
const { ethers } = require("hardhat");

// cd smartcontract-deployer
// npx hardhat test

let contract;
let transaction;
let contractAddress;
let contractFunctions;

let white;
let whiteAddress;
let black;
let blackAddress;
let spectator;
let spectatorAddress;

beforeEach(async () => {
  [white, black, spectator] = await ethers.getSigners(); // is an an array of wallet objects.
  whiteAddress = await white.getAddress();
  blackAddress = await black.getAddress();
  spectatorAddress = await spectator.getAddress();


  const FenService = await ethers.getContractFactory("FenService");
  contract = await FenService.deploy();

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
    expect(whiteAddress).to.be.equal(initialMsgSender);

    // Changing the wallet with which we connect to the SmartContract with.
    const contractAsBlack = contract.connect(black);

    // Sending a message to the SmartContract with black's wallet.
    let changedMsgSender = await contractAsBlack.getMsgSender();
    expect(blackAddress).to.be.equal(changedMsgSender);
  });

  //--------------------------------------------------------------------------------------------------------------------

  it("only gives the creator their special message", async function () {
    expect(await contract.getSpecialMessage()).to.be.equal("Luke, I am your father!");

    const contractAsBlack = contract.connect(black);
    await expect(contractAsBlack.getSpecialMessage()).to.be.reverted;
  });

  //--------------------------------------------------------------------------------------------------------------------

  // TODO it creates a new fenboard and returns the current fenboard id. Do I need an ID? Might make searching arrays easier -> some hash of the two addresses could be the ID?

  it("creates a new board and receives a successful transaction", async function () {
    const transaction = await contract.createBoard(whiteAddress, blackAddress);
    await transaction.wait();

    expect(transaction.data).to.exist;
  });

  //--------------------------------------------------------------------------------------------------------------------

  it("asserts the board's creating address is the FenService contract's address", async function () {
    const transaction = await contract.createBoard(whiteAddress, blackAddress);
    await transaction.wait();

    const boardCreator = await contract.getBoardCreator(whiteAddress, blackAddress);

    expect(boardCreator).to.be.equal(contractAddress);
  });

  //--------------------------------------------------------------------------------------------------------------------

  it("creates a new board and asserts the initial board's state", async function () {
    const transaction = await contract.createBoard(whiteAddress, blackAddress);
    await transaction.wait();
    
    const fenBoardState = await contract.getBoardState(whiteAddress, blackAddress);

    const INITIAL_BOARD_STATE = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    expect(fenBoardState).to.equal(INITIAL_BOARD_STATE);
  });

  //--------------------------------------------------------------------------------------------------------------------

  it("updates the board and asserts the updated board's state", async function () {
    const transaction = await contract.createBoard(whiteAddress, blackAddress);
    await transaction.wait();

    const transaction2 = await contract.updateBoard("A new board state", whiteAddress, blackAddress); // TODO: Secure contract against injection somehow?
    await transaction2.wait();

    const fenBoardState = await contract.getBoardState(whiteAddress, blackAddress);
    expect(fenBoardState).to.equal("A new board state");
  });

  //--------------------------------------------------------------------------------------------------------------------

  it("does not allow a spectator's address to update the board state", async function () {
    let msgSender = await contract.getMsgSender();
    expect(whiteAddress).to.be.equal(msgSender);

    // Create a new board (as white).
    const transaction = await contract.createBoard(whiteAddress, blackAddress);
    await transaction.wait();

    // Update the board as white.
    const transaction2 = await contract.updateBoard("A new state", whiteAddress, blackAddress);
    await transaction2.wait();

    let fenBoardState = await contract.getBoardState(whiteAddress, blackAddress);
    expect(fenBoardState).to.equal("A new state");

    const contractAsBlack = contract.connect(black);

    msgSender = await contractAsBlack.getMsgSender();
    expect(blackAddress).to.be.equal(msgSender);

    // Update the board as black.
    const transaction3 = await contractAsBlack.updateBoard("A newer state", whiteAddress, blackAddress);
    await transaction3.wait();

    fenBoardState = await contractAsBlack.getBoardState(whiteAddress, blackAddress);
    expect(fenBoardState).to.equal("A newer state");

    const contractAsSpectator = contract.connect(spectator);
    
    msgSender = await contractAsSpectator.getMsgSender();
    expect(spectatorAddress).to.be.equal(msgSender);

    // Update the board as spectator. Expect the transaction to be reverted.
    await expect(contractAsSpectator.updateBoard("An EVEN newer state", whiteAddress, blackAddress)).to.be.reverted;
  });

  //--------------------------------------------------------------------------------------------------------------------

  it("accepts donations", async function () {
    const initialContractBalance = await contract.getTotalBalance();
    expect(initialContractBalance).to.be.equal(0);

    // Sends exactly 1.0 ether to the contract.
    const transactionHash = await white.sendTransaction({
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
    const transactionHash = await white.sendTransaction({
      to: contractAddress,
      value: ethers.utils.parseEther("1.0"), 
    });

    contractBalance = await contract.getTotalBalance();
    expect(contractBalance).to.be.equal(ethers.utils.parseEther("1.0"));

    // Sends exactly 1.0 ether to the contract as black.
    const transactionHash2 = await black.sendTransaction({
      to: contractAddress,
      value: ethers.utils.parseEther("1.5"), 
    });

    // Asserts the total balance is equal to both donations.
    contractBalance = await contract.getTotalBalance();
    expect(contractBalance).to.be.equal(ethers.utils.parseEther("2.5"));

    // Asserts that white and black have separate balances.
    const balanceOfWhite = await contract.getMyBalance();
    expect(balanceOfWhite).to.be.equal(ethers.utils.parseEther("1.0"));

    const contractAsBlack = contract.connect(black);
    const balanceOfBlack = await contractAsBlack.getMyBalance();
    expect(balanceOfBlack).to.be.equal(ethers.utils.parseEther("1.5"));
  });

  //--------------------------------------------------------------------------------------------------------------------

  it("only allows correct withdrawals", async function () {
    let contractBalance = await contract.getTotalBalance();
    expect(contractBalance).to.be.equal(0);

    // Sends exactly 1.0 ether to the contract as white.
    const transactionHash = await white.sendTransaction({
      to: contractAddress,
      value: ethers.utils.parseEther("1.0"), 
    });

    // Sends exactly 1.5 ether to the contract as black.
    const transactionHash2 = await black.sendTransaction({
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
    const contractAsSpectator = contract.connect(spectator);
    expect(contractAsSpectator.withdraw(ethers.utils.parseEther("1.0"))).to.be.reverted;
  });
  
});