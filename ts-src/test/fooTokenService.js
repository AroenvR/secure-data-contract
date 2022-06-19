const { expect } = require("chai");
const { ethers } = require("hardhat");
const ERC20ABI = require("./util/erc20abi");

let provider = ethers.getDefaultProvider();

let fooTokenServiceContract;
let transaction;
let fooTokenServiceAddress;

let fooTokenContract;
let fooTokenAddress;

let user1;
let user1Address;
let user2;
let user2Address;
let user3;
let user3Address;

const DAI_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f";

beforeEach(async () => {
  [user1, user2, user3] = await ethers.getSigners(); // is an an array of wallet objects.
  user1Address = await user1.getAddress();
  user2Address = await user2.getAddress();
  user3Address = await user3.getAddress();

  const FooTokenService = await ethers.getContractFactory("FooTokenService");

  fooTokenServiceContract = await FooTokenService.deploy();
  await fooTokenServiceContract.deployed();

  fooTokenAddress = await fooTokenServiceContract.getTokenAddress();

  fooTokenServiceAddress = fooTokenServiceContract.address;
  transaction = fooTokenServiceContract.deployTransaction;

  expect(transaction).to.exist;
});

describe("The FooTokenService contract:", function () {

    it("asserts the creator of the contract", async function () {
        let creator = await fooTokenServiceContract.getCreatorAddress();
        expect(creator).to.be.equal(user1Address);
    });

    //--------------------------------------------------------------------------------------------------------------------

    it("creates FooTokens with 1 starting supply", async function () {
        let totalSupply = await fooTokenServiceContract.getTotalTokenSupply();
        expect(totalSupply).to.be.equal(1);
    });

    //--------------------------------------------------------------------------------------------------------------------

    it("asserts the service is the creator of our token", async function () {
        let tokenCreator = await fooTokenServiceContract.getTokenCreator();
        expect(tokenCreator).to.be.equal(fooTokenServiceAddress);
    });

    //--------------------------------------------------------------------------------------------------------------------
  
    it("allows users to mint", async function () {
        let currentBalance = await fooTokenServiceContract.getBalanceOf(user1Address);
        expect(currentBalance).to.be.equal(0);

        await fooTokenServiceContract.mint(user2Address, 1);
        currentBalance = await fooTokenServiceContract.getBalanceOf(user2Address);
        expect(currentBalance).to.be.equal(1);
    });

    // Trying to mint with Dai -> 1 Dai == 1 Breaker starting value
    // it("allows users to mint with Dai", async function () {
        // const Dai = new ethers.Contract(DAI_ADDRESS, ERC20ABI, provider);
        // const locallyManipulatedBalance = 100000;

        // const index = ethers.utils.solidityKeccak256(
        //     ["uint256", "uint256"],
        //     [user1Address, DAI_SLOT] // key, slot
        //   );

        // await provider.setStorageAt(
        //     DAI_ADDRESS,
        //     index.toString(),
        //     ethers.utils.formatBytes32String(locallyManipulatedBalance.toString())
        //     // toBytes32(locallyManipulatedBalance).toString()
        // );

        // let DAIBalance = await Dai.balanceOf(owner.address);
        // console.log("DAI balance: " + DAIBalance);
        
    // });
    
});
