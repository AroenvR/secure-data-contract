const { ethers } = require("hardhat");
const { expect } = require("chai");

const erc20abi = require("./util/erc20abi.json");
const { provider, wallet, testProvider, testWallet } = require('./network-config/binanceConfig');

// BINANCE SMART CHAIN ADDRESSES
const adressList = {
    wbnb: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", // WBNB token address
    busd: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", // BUSD token address
    usdt: "0x55d398326f99059fF775485246999027B3197955",  // USDT token address
    static: "0x7dEb9906BD1d77B410a56E5C23c36340Bd60C983", // ChargeDeFi Static token address
    factory: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73", // PancakeSwap Factory
    personal: wallet.address, // My public address
}

describe("Binance wallet", async () => {

    it("returns BNB balance", async () => {
        const balance = await provider.getBalance(wallet.address); // Actual wallet's native currency (Binance Coin)
        const bnbBalance = ethers.utils.formatEther(balance); // Formatted BNB balance

        expect(bnbBalance).to.exist;
    });

    //--------------------------------------------------------------------------------------------------------------------

    it("returns TESTNET BNB balance", async () => {
        const testBalance = await testProvider.getBalance(wallet.address); // Actual wallet's native currency (Test Binance Coin)
        const testBnbBalance = ethers.utils.formatEther(testBalance); // Formatted TestNet BNB balance

        expect(testBnbBalance).to.exist;
    });

    // //--------------------------------------------------------------------------------------------------------------------

    it("returns BUSD balance", async () => {
        // const erc20balanceOf = [ // ERC20 tokens balanceOf function
        //     {"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
        // ];

        let contract = new ethers.Contract(adressList.busd, erc20abi, provider); // BUSD contract
        const busdBalance = ethers.utils.formatEther((await contract.balanceOf(wallet.address)));

        expect(busdBalance).to.exist;

        // contract = new ethers.Contract(adressList.static, erc20balanceOf, provider); // Static contract
        // const staticBalance = ethers.utils.formatEther((await contract.balanceOf(wallet.address)));

        // expect(staticBalance).equal(0);
    });

});