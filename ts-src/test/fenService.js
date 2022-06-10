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
let black;
beforeEach(async () => {
  [white, black] = await ethers.getSigners(); // is an an array of wallet objects.

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

  // TODO it creates a new fenboard and returns the current fenboard id. Do I need an ID? Might make searching arrays easier -> some hash of the two addresses could be the ID?

  it("creates a new board and receives a successful transaction", async function () {
    const transaction = await contract.createBoard(white.getAddress(), black.getAddress());
    await transaction.wait();

    expect(transaction.data).to.exist;
  });

  it("creates a new board and asserts the initial board's state", async function () {
    const transaction = await contract.createBoard(white.getAddress(), black.getAddress());
    await transaction.wait();
    
    const fenBoardState = await contract.getBoardState(white.getAddress(), black.getAddress());

    const INITIAL_BOARD_STATE = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    expect(fenBoardState).to.equal(INITIAL_BOARD_STATE);
  });

  // updates the board
  it("updates the board and asserts the updated board's state", async function () {
    const transaction = await contract.createBoard(white.getAddress(), black.getAddress());
    await transaction.wait();

    const NEW_BOARD_STATE = "I need to make a fen string for this. And secure the SmartContract from injection."; // TODO: make a fen string. And secure the SmartContract from injection.

    const transaction2 = await contract.updateBoard(NEW_BOARD_STATE, white.getAddress(), black.getAddress());
    await transaction2.wait();

    const fenBoardState = await contract.getBoardState(white.getAddress(), black.getAddress());
    expect(fenBoardState).to.equal(NEW_BOARD_STATE);
  });
  
});