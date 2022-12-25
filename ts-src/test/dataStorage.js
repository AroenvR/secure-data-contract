// import { expect } from 'chai';
// import { ethers } from "hardhat";
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { isTruthy } = require("./util/isTruthy.js");
const { sha2, keccak, aesEncrypt, aesDecrypt } = require("./util/cryptoService.js");

/*
    cd [FOLDER_NAME]
    npx hardhat test

    If running a Ganache server:
    npx hardhat --network localhost test

    Just this file (on a Ganache server):
    npx hardhat --network localhost test ./ts-src/test/dataStorage.js
*/

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

let pinCode = 69420;
let pidHash = keccak("First name", "Surname", "01/01/1999", "Question?", "Answer");
let argon2CipherSecret = sha2(pidHash, pinCode);

beforeEach(async () => {
  [user1, user2, user3] = await ethers.getSigners();
  user1Address = await user1.getAddress();
  user2Address = await user2.getAddress();
  user3Address = await user3.getAddress();

  const dataSorageContract = await ethers.getContractFactory("DataStore");
  contract = await dataSorageContract.deploy(pinCode);

  contractAddress = contract.address;
  transaction = contract.deployTransaction;

  const successfullDeploy = await contract.deployed();
  contractFunctions = successfullDeploy.functions;

  expect(transaction).to.exist;
});

describe("DataStore successfully deployed, the contract:", function () {
  
  it("Allows us to store and verify a cipherText", async function () {
    const data = "Some sensitive data.";
    const cipherText = aesEncrypt(data, argon2CipherSecret);

    await contract.addCipherText(pinCode, cipherText);

    let cipherTextArr = await contract.getCipherTexts(pinCode);
    expect(isTruthy(cipherTextArr)).to.be.true;
    
    let originalText = aesDecrypt(cipherTextArr[0], argon2CipherSecret);
    expect(originalText).to.equal(data);
  });

  //--------------------------------------------------------------------------------------------------------------------

});
