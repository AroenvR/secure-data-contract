const { expect } = require("chai");
const { ethers } = require("hardhat");

let provider = ethers.getDefaultProvider();

let fooTokenContract;
let transaction;
let contractAddress;

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

  const FooToken = await ethers.getContractFactory("FooToken");

  // let godHash = ethers.utils.formatBytes32String("God's hashed secret."); // Keeping this for potential future use.

  fooTokenContract = await FooToken.deploy("FooToken", "FTN");
  const successfullDeploy = await fooTokenContract.deployed();

  contractAddress = fooTokenContract.address;
  transaction = fooTokenContract.deployTransaction;

  expect(transaction).to.exist;

  contractFunctions = successfullDeploy.functions;
  // console.log(contractFunctions)
});

describe("The token's contract:", function () {
  
  it("gets minted with 1 token", async function () {
    let initialBalance = await fooTokenContract.balanceOf(user1Address);
    expect(initialBalance).to.be.equal(1);
  });

  //--------------------------------------------------------------------------------------------------------------------

  it("returns the total supply of tokens", async function () {
    let totalSupply = await fooTokenContract.totalSupply();
    expect(totalSupply).to.be.equal(1);
  });

  //--------------------------------------------------------------------------------------------------------------------

  it("returns its name and symbol correctly", async function () {
    let name = await fooTokenContract.name();
    expect(name).to.be.equal("FooToken");

    let symbol = await fooTokenContract.symbol();
    expect(symbol).to.be.equal("FTN");
  });

  //--------------------------------------------------------------------------------------------------------------------

  it("returns the correct decimals", async function () {
    let decimals = await fooTokenContract.decimals();
    expect(decimals).to.be.equal(18);
  });

  //--------------------------------------------------------------------------------------------------------------------

  it("lets the creator mint tokens", async function () {
    let balance = await fooTokenContract.balanceOf(user1Address);
    expect(balance).to.be.equal(1);

    await fooTokenContract.mint(user1Address, 1);
    balance = await fooTokenContract.balanceOf(user1Address);
    expect(balance).to.be.equal(2);

    let totalSupply = await fooTokenContract.totalSupply();
    expect(totalSupply).to.be.equal(2);
  });

  //--------------------------------------------------------------------------------------------------------------------

  it("asserts only the creator can mint tokens", async function () {
    let totalSupply = await fooTokenContract.totalSupply();
    expect(totalSupply).to.be.equal(1);

    const connectedAsUser2 = fooTokenContract.connect(user2);
    expect(connectedAsUser2.mint(user2Address, 1)).to.be.revertedWith("You are not allowed to mint Breaker tokens.");

    expect(totalSupply).to.be.equal(1);
  });

});
