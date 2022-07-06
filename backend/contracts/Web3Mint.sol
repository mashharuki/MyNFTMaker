// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * Web3Mintコントラクト
 * ERC721URIStorageを継承する。
 */
contract Web3Mint is ERC721URIStorage {

    // トークンID用の変数
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    /**
     * コンストラクター
     */
    constructor() ERC721 ("mashharuki", "MSH") {
        console.log("This is my NFT contract.");
    }

    /**
     * NFTをミントするためのメソッド
     */
    function makeAnEpicNFT() public {
        // トークンIDを取得する。
        uint256 newItemId = _tokenIds.current();
        // mint
        _safeMint(msg.sender, newItemId);
        // トークンURIを設定する。
        _setTokenURI(
            newItemId, 
            '{"name":"Mash","description":"mash!!","image":"https://i.ibb.co/vcpwPqH/IMG-4822.jpg"}'
        );
       
        console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);
        // インクリメント
        _tokenIds.increment();
  }
}