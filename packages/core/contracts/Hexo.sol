// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@ensdomains/ens/contracts/ENS.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract Hexo is ERC721, Ownable {
    using Address for address payable;

    /// Fields

    uint256 public price;
    mapping(bytes32 => bool) public colors;
    mapping(bytes32 => bool) public objects;
    mapping(uint256 => bytes32) public tokenIdToHexoLabel;

    string private baseURI;
    mapping(uint256 => string) private tokenURIs;

    address public constant ens =
        address(0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e);
    // namehash("hexo.eth")
    bytes32 public constant hexoRootNode =
        0xf55a38be8aab2a9e033746f5d0c4af6122e4dc9e896858445fa8e2e46abce36c;

    /// Events

    event ItemBought(string color, string object, address buyer);

    /// Constructor

    constructor(uint256 _price, string memory _baseURI)
        ERC721("Hexo Codes", "HEXO")
    {
        price = _price;
        baseURI = _baseURI;

        colors[keccak256("red")] = true;
        colors[keccak256("green")] = true;
        colors[keccak256("blue")] = true;

        objects[keccak256("dragon")] = true;
        objects[keccak256("turtle")] = true;
        objects[keccak256("penguin")] = true;
    }

    /// Owner actions

    function changePrice(uint256 _price) external onlyOwner {
        price = _price;
    }

    function changeBaseURI(string calldata _baseURI) external onlyOwner {
        baseURI = _baseURI;
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

    /// User actions

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

        emit ItemBought(_color, _object, msg.sender);
    }

    function setTokenURI(uint256 _tokenId, string calldata _tokenURI) external {
        require(ownerOf(_tokenId) == msg.sender, "Unauthorized");
        tokenURIs[_tokenId] = _tokenURI;
    }

    /// Overrides

    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        string memory uri = tokenURIs[_tokenId];
        return bytes(uri).length > 0 ? uri : super.tokenURI(_tokenId);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function _beforeTokenTransfer(
        address,
        address _to,
        uint256 _tokenId
    ) internal override {
        bytes32 hexoLabel = tokenIdToHexoLabel[_tokenId];
        ENS(ens).setSubnodeOwner(hexoRootNode, hexoLabel, _to);
    }
}
