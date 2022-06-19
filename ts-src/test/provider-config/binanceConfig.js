require('dotenv').config();
const ethers = require('ethers');

const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/', { name: 'binance', chainId: 56 });
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const testProvider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/', { name: 'binance testnet', chainId: 97 }); // TODO: check if this works
const testWallet = new ethers.Wallet(process.env.PRIVATE_KEY, testProvider);

module.exports = { provider, wallet, testProvider, testWallet };