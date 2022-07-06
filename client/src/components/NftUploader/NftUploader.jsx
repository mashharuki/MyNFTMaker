import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import ImageLogo from "./image.svg";
import "./NftUploader.css";

/**
 * NftUploaderコンポーネント
 */
const NftUploader = () => {

  // ステート変数
  const [currentAccount, setCurrentAccount] = useState("");

  const { ethereum } = window;

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

  // 副作用フック
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="outerBox">
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
        <input className="nftUploadInput" multiple name="imageURL" type="file" accept=".jpg , .jpeg , .png"  />
      </div>
      <p>または</p>
      <Button variant="contained">
        ファイルを選択
        <input className="nftUploadInput" type="file" accept=".jpg , .jpeg , .png"/>
      </Button>
    </div>
  );
};

export default NftUploader;