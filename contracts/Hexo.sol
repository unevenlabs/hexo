// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@ensdomains/ens/contracts/ENS.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract Hexo is ERC721, Ownable {
    using Address for address payable;

    // 0.08 ETH
    uint256 public price = 80000000000000000;

    mapping(bytes32 => bool) public colors;
    mapping(bytes32 => bool) public objects;

    mapping(uint256 => bytes32) public tokenIdToHexoLabel;

    address public constant ens =
        address(0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e);

    // namehash("hexo.eth")
    bytes32 public constant hexoRootNode =
        0xf55a38be8aab2a9e033746f5d0c4af6122e4dc9e896858445fa8e2e46abce36c;

    constructor() ERC721("Hexo Codes", "HEXO") {
        colors[keccak256("red")] = true;
        colors[keccak256("green")] = true;
        colors[keccak256("blue")] = true;

        objects[keccak256("dragon")] = true;
        objects[keccak256("turtle")] = true;
        objects[keccak256("penguin")] = true;
    }

    function changePrice(uint256 _price) external onlyOwner {
        price = _price;
    }

    function addColors(string[] calldata _colors) external onlyOwner {
        for (uint256 i = 0; i < _colors.length; i++) {
            bytes32 colorHash = keccak256(bytes(_colors[i]));
            require(!colors[colorHash], "Color already added");
            colors[colorHash] = true;
        }
    }

    function addObjects(string[] calldata _objects) external onlyOwner {
        for (uint256 i = 0; i < _objects.length; i++) {
            bytes32 objectHash = keccak256(bytes(_objects[i]));
            require(!objects[objectHash], "Object already added");
            objects[objectHash] = true;
        }
    }

    function claim(address payable _to, uint256 _amount) external onlyOwner {
        _to.sendValue(_amount);
    }

    function buy(string calldata _color, string calldata _object)
        external
        payable
    {
        require(msg.value == price, "Insufficient amount");

        bytes32 colorHash = keccak256(bytes(_color));
        require(colors[colorHash], "Color not added");
        bytes32 objectHash = keccak256(bytes(_object));
        require(objects[objectHash], "Object not added");

        bytes memory hexoName = abi.encodePacked(_color, _object);
        bytes32 hexoLabel = keccak256(hexoName);

        uint256 tokenId = uint256(hexoLabel);
        tokenIdToHexoLabel[tokenId] = hexoLabel;
        _safeMint(msg.sender, tokenId);
    }

    function _beforeTokenTransfer(
        address,
        address to,
        uint256 tokenId
    ) internal override {
        bytes32 hexoLabel = tokenIdToHexoLabel[tokenId];
        ENS(ens).setSubnodeOwner(hexoRootNode, hexoLabel, to);
    }
}
