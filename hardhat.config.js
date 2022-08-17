/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();
const { API_KEY, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: {
    version: "0.8.9",
  },
  networks: {
    goerli: {
      url: `${API_KEY}`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
  paths: {
    artifacts: "./coffeedapp/src/artifacts",
  },
};
