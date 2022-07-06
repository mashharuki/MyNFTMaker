/**
 * Web3Mintコントラクト用のテストコード
 */

const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Web3Mint",  () => {
    it("Should return the nft", async () => {
      const Mint = await ethers.getContractFactory("Web3Mint");
      const mintContract = await Mint.deploy();
      await mintContract.deployed();

      const [owner, addr1] = await ethers.getSigners();

      let nftName = 'mash'
      let ipfsCID = 'bafybeifabivc6ehwzoxpeju45jjuxlkgirdmfl4zd4jwxkzvmhif4ribxu'

      await mintContract.connect(owner).mintIpfsNFT(nftName,ipfsCID) //0
      await mintContract.connect(addr1).mintIpfsNFT(nftName,ipfsCID) //1

      console.log(await mintContract.tokenURI(0))
      console.log(await mintContract.tokenURI(1))


    });
});