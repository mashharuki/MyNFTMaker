import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import ImageLogo from "./image.svg";
import "./NftUploader.css";
import { ethers } from "ethers";
import Web3Mint from "./../../contracts/contracts/Web3Mint.sol/Web3Mint.json";
import { Web3Storage } from 'web3.storage';
//import polygonLogo from './../../assets/polygonlogo.png';
//import ethLogo from './../../assets/ethlogo.png';
//import { networks } from './../../utils/networks';
import Loadingindicator from "./../LoadingIndicator/LoadingIndicator"; 

// コントラクトのアドレスを取得する。
const CONTRACT_ADDRESS ="0x970F75E1295314A78b317E3f27c8d6353BEF009D";
// OpenSeaへのリンク
const OPENSEA_LINK  = "https://testnets.opensea.io/collection/mashharuki-v2";

// 設定ファイルから読み取る。
const { 
  REACT_APP_API_TOKEN
} = process.env;

/**
 * NftUploaderコンポーネント
 */
const NftUploader = () => {

  // ステート変数
  const [currentAccount, setCurrentAccount] = useState("");
  const [network, setNetwork] = useState("");
  const [loading, setLoading] = useState(false);

  const { ethereum } = window;
  // アカウントが変更されたタイミングで再読み込み
	ethereum.on('accountsChanged', () => window.location.reload());
	// チェーンが変更されたタイミングでも再読み込み
	ethereum.on('chainChanged', async () => {
    // 接続したチェーンの種類によって処理を分岐する。
		const chainId = await ethereum.request({ method: 'eth_chainId' });

    if (chainId !== '0x13881') {
      // switchNetworkメソッドの呼び出し
      switchNetwork();
    } else {
      window.location.reload();
    }

    // 再度チェーンIDを取得してステート変数に設定する。
    const newChainId = await ethereum.request({ method: 'eth_chainId' });
    setNetwork(newChainId);
  });

  /**
   * ウォレットの接続状態をチェックするメソッド
   */
  const checkIfWalletIsConnected = async () => {
    /*
     * ユーザーがMetaMaskを持っているか確認します。
     */
    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    // アカウントを要求するメソッド
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      // ステート変数を更新する。
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };

  /**
   * connectWalletボタンを押した時の処理
   */
  const connectWallet = async () =>{
    try {
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      // 接続したチェーンの種類によって処理を分岐する。
      const chainId = await ethereum.request({ method: 'eth_chainId' });

      if (chainId !== '0x13881') {
        // switchNetworkメソッドの呼び出し
        switchNetwork();
      } 

      // 再度チェーンIDを取得してステート変数に設定する。
      const newChainId = await ethereum.request({ method: 'eth_chainId' });
      setNetwork(newChainId);

      /*
       * ウォレットアドレスに対してアクセスをリクエストしています。
       */
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);

      // ステート変数を更新する。
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * renderNotConnectedContainerコンポーネント
   */
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  /**
   * アップロードした画像をNFTに変換(MINT)するメソッド
   * @param {*} e イベントオブジェクト
   */
  const imageToNFT = async (e) => {
    // Web3Storageオブジェクトをインタンス化する。
    const client = new Web3Storage({ token: REACT_APP_API_TOKEN })
    // 画像データを取得する。
    const image = e.target;
    console.log(image)
    // CID用のリクエストパラメータを作成
    const rootCid = await client.put(image.files, {
        name: 'experiment',
        maxRetries: 3
    })

    // laodingフラグをオンにする。
    setLoading(true);
    // APIを実行
    const res = await client.get(rootCid);
    // レスポンスを取得する 。
    const files = await res.files();
    // オフにする。
    setLoading(false);

    // ファイルを取得できたのであれば実行する。
    for (const file of files) {
      console.log("file.cid:",file.cid)
      // CIDを引数にしてNFTをMINTするメソッドを呼び出す。
      askContractToMintNft(file.cid)
    }
}

  /**
   * NFTをミントするためのボタン
   */
   const askContractToMintNft = async (ipfs) => {

    try {
      if (ethereum) {
        // laodingフラグをオンにする。
        setLoading(true);

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        // コントラクトをインスタンス化する。
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          Web3Mint.abi,
          signer
        );
        console.log("Going to pop wallet now to pay gas...");

        // NFTをミントする。
        let nftTxn = await connectedContract.mintIpfsNFT("mash",ipfs);

        console.log("Mining...please wait.");
        await nftTxn.wait();
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
        // オフにする。
        setLoading(false);
        alert("Mint Successfull!!");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
      // オフにする。
      setLoading(false);
      alert("Mint failfull・・・");
    }
  };

  /**
	 * ネットワークをMunbaiに切り替えさせるメソッド
	 */
	 const switchNetwork = async () => {
		if (window.ethereum) {
		  try {
        // Mumbai testnet に切り替えさせるメソッドを呼び出す。
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x13881' }], 
        });
		  } catch (error) {
			// ネットワークを追加させる。
			if (error.code === 4902) {
			  try {
				// ネットワーク追加のメソッドを呼び出す。
				await window.ethereum.request({
				  method: 'wallet_addEthereumChain',
				  params: [
					{
					  chainId: '0x13881',
					  chainName: 'Polygon Mumbai Testnet',
					  rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
					  nativeCurrency: {
						  name: "Mumbai Matic",
						  symbol: "MATIC",
						  decimals: 18
					  },
					  blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
					},
				  ],
				});
			  } catch (error) {
				console.log(error);
			  }
			}
			console.log(error);
		  }
		} else {
		  // window.ethereum が見つからない場合メタマスクのインストールを促します。
		  alert('MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html');
		}
    // 再リロード
    window.location.reload();
	}

  // 副作用フック
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="outerBox">
      { !loading ? ( 
        <>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <p>If you choose image, you can mint your NFT</p>
          )}
          <div className="title">
            <h2>NFTアップローダー</h2>
            <p>JpegかPngの画像ファイル</p>
          </div>
          <div className="nftUplodeBox">
            <div className="imageLogoAndText">
              <img src={ImageLogo} alt="imagelogo" />
              <p>ここにドラッグ＆ドロップしてね</p>
            </div>
            <input className="nftUploadInput" multiple name="imageURL" type="file" accept=".jpg , .jpeg , .png" onChange={imageToNFT} />
          </div>
          <p>または</p>
          <Button variant="outlined">
            ファイルを選択
            <input className="nftUploadInput" type="file" accept=".jpg , .jpeg , .png" onChange={imageToNFT} />
          </Button>
          <br/>
          <Button variant="contained" className="mint-button" href={OPENSEA_LINK} >
            OpenSeaでNFTを確認する
          </Button>
        </>
      ) : (
        <>
          {/* ローディングプログレスバー出力 */}
          <Loadingindicator/>
          <h3>Please wait・・・・・</h3>
        </>
      ) }
     </div>
  );
};

export default NftUploader;