const { HardhatUserConfig } = require("hardhat/config");
require("@nomicfoundation/hardhat-toolbox");
require("dotenv/config");

const config = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    "sepolia-alchemy": {
      url: `${process.env.ALCHEMY_API_URL}`,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY],
    },
    "sepolia-infura": {
      url: `${process.env.INFURA_API_URL}`,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY],
    },
  },
};

module.exports = config;
