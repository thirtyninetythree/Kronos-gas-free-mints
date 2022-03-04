// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@opengsn/contracts/src/BaseRelayRecipient.sol";

import "@openzeppelin/contracts@4.5.0/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.5.0/access/Ownable.sol";
// forwarder on kovan 0x7eEae829DF28F9Ce522274D5771A6Be91d00E5ED
contract Kronos is BaseRelayRecipient, ERC721, Ownable {
    constructor(address forwarder) ERC721("Kronos", "KNS") {
        _setTrustedForwarder(forwarder);
    }

    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(_msgSender(), tokenId);
    }
    string public override versionRecipient = "2.2.0";

  function _msgSender() internal view override(Context, BaseRelayRecipient)
      returns (address sender) {
      sender = BaseRelayRecipient._msgSender();
  }

  function _msgData() internal view override(Context, BaseRelayRecipient)
      returns (bytes memory) {
      return BaseRelayRecipient._msgData();
  }
}

