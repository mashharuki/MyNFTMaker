/**
 * 本番向けデプロイファイル
 */

const main = async () => {
    // コントラクトを読み込む
    const nftContractFactory = await hre.ethers.getContractFactory("Web3Mint");
    const nftContract = await nftContractFactory.deploy();
    // デプロイする。
    await nftContract.deployed();
    console.log("Contract deployed to:", nftContract.address);
    /*
    // mint1回目
    let txn = await nftContract.makeAnEpicNFT();
    await txn.wait();
    console.log("Minted NFT #1");

    // mint2回目
    txn = await nftContract.makeAnEpicNFT();
    await txn.wait();
    console.log("Minted NFT #2");
    */
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