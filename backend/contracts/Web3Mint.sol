// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./lib/Base64.sol";

/**
 * Web3Mintコントラクト
 * ERC721を継承する。
 */
contract Web3Mint is ERC721 {

    // NFT用の構造体の定義
    struct NftAttributes{
        string name;
        string imageURL;
    }

    // NftAttributes型の配列
    NftAttributes[] Web3Nfts;

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
     * @param name NFT名
     * @param imageURI コンテンツまでのURI
     */
    function mintIpfsNFT(string memory name,string memory imageURI) public {
        // トークンIDを取得する。
        uint256 newItemId = _tokenIds.current();
        // NFTをミントする。
        _safeMint(msg.sender,newItemId);

        // Web3Nftsにプッシュする。
        Web3Nfts.push(NftAttributes({
            name: name,
            imageURL: imageURI
        }));

        console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);
        // トークンIDをインクリメント
        _tokenIds.increment();
    }

    /**
     * IDに紐づくコンテンツのURI情報を取得するメソッド
     * @param _tokenId トークンID
     */
    function tokenURI(uint256 _tokenId) public override view returns(string memory){
        // jsonデータをBase64形式にエンコードする。
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        Web3Nfts[_tokenId].name,
                        ' -- NFT #: ',
                        Strings.toString(_tokenId),
                        '", "description": "An epic NFT", "image": "ipfs://',
                        Web3Nfts[_tokenId].imageURL,'"}'
                    )
                )
            )
        );
        // ヘッダー部分をくっ付けて作成
        string memory output = string(abi.encodePacked("data:application/json;base64,", json));

        return output;
    }
}