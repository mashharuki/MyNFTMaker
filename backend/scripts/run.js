/**
 * テスト用のスクリプトファイル
 */
const main = async () => {
    // コントラクトの読み込み
    const nftContractFactory = await hre.ethers.getContractFactory("Web3Mint");
    // Hardhat がローカルの Ethereum ネットワークを作成します。
    const nftContract = await nftContractFactory.deploy();
    // デプロイする。
    await nftContract.deployed();
    console.log("Contract deployed to:", nftContract.address);

    // mint1回目
    let txn = await nftContract.makeAnEpicNFT();
    await txn.wait();

    // mint2回目
    txn = await nftContract.makeAnEpicNFT();
    await txn.wait();
};

// エラー処理を行っています。
const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
};

runMain();