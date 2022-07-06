/**
 * hardhat用の設定ファイル
 */
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

// 設定ファイルからの読み込む
const {
  PRIVATE_KEY, 
  POLYGON_URL
} = process.env;


task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: "0.8.4",
  paths: {                         
    artifacts: './../client/src/contracts',  
  },
  networks: {
    munbai: {
      url: POLYGON_URL,
      accounts: [PRIVATE_KEY],
    },
    shibuya: {
      url:"https://shibuya.public.blastapi.io",
      chainId:81,
      accounts:[PRIVATE_KEY],
    }
  }
};
