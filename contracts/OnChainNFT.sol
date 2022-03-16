// SPDX-License-Identifier: MIT


pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@opengsn/contracts/src/BaseRelayRecipient.sol";
import "./Base64.sol";

contract KronosOnChain is BaseRelayRecipient, ERC721, ERC721Enumerable {
  using Strings for uint256;

    string public override versionRecipient = "2.2.0";
  
   struct Word { 
      string name;
      string description;
   }
  
  mapping (uint256 => Word) public words;
  
  constructor(address forwarder) ERC721("Kronos On Chain", "KNS") {
      _setTrustedForwarder(forwarder);
  }

 
    function safeMint(uint256 tokenId) public  {
        require(tokenId < 86000);
        _safeMint(_msgSender(), tokenId);
    }
  
  function convertSeconds(uint256 value) private pure returns(string memory) {
    uint hour; 
    uint minute;
    uint second;

    string memory hh; 
    string memory mm;
    string memory ss;
    hour   = value / 3600;
    minute = (value - (hour * 3600)) / 60; // get minutes
    second = value - (hour * 3600) - (minute * 60); //  get seconds
    // add 0 if value < 10; Example: 2 => 02
    
        
    if (hour   < 10) {hh = string(abi.encodePacked('0', hour.toString())) ;}
    if (minute < 10) {mm = string(abi.encodePacked('0', minute.toString()));}
    if (second < 10) {ss = string(abi.encodePacked('0', second.toString()));}
    return string(abi.encodePacked(hh, ":", mm, ":", ss)); // Return is HH : MM : SS
  }

  
  function buildImage(uint256 _tokenId) public pure returns(string memory) {
      return Base64.encode(bytes(
          abi.encodePacked(
              '<svg width="500" height="500" xmlns="http://www.w3.org/2000/svg">',
              '<rect height="500" width="500" fill="#000"/>',
              '<text xml:space="preserve" text-anchor="middle"  font-size="140" y="50%" x="50%"  stroke="#fff" fill="#fff">', convertSeconds(_tokenId),'</text>',
              '</svg>'
          )
      ));
  }
  
  function buildMetadata(uint256 _tokenId) public pure returns(string memory) {
      Word memory newWord = Word(_tokenId.toString(), "Own a slice of time on the blockchain");
    
      return string(abi.encodePacked(
              'data:application/json;base64,', Base64.encode(bytes(abi.encodePacked(
                  '{"name":"Kronos #', 
                          newWord.name,
                          '", "description":"', 
                          newWord.description,
                          '", "image": "', 
                          'data:image/svg+xml;base64,', 
                          buildImage(_tokenId),
                          '"}'
                        
                  )))));
  }                       

  function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
      require(_exists(_tokenId),"ERC721Metadata: URI query for nonexistent token");
      return buildMetadata(_tokenId);
  }

  function _msgSender() internal view override(Context, BaseRelayRecipient)
      returns (address sender) {
      sender = BaseRelayRecipient._msgSender();
  }

  function _msgData() internal view override(Context, BaseRelayRecipient)
      returns (bytes memory) {
      return BaseRelayRecipient._msgData();
  }
   function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
