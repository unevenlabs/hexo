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
    mapping(bytes32 => uint256) public colors;
    mapping(bytes32 => uint256) public objects;
    mapping(uint256 => bytes32) public tokenIdToHexoLabel;

    string private baseURI;
    mapping(uint256 => string) private tokenURIs;

    address public constant ens =
        address(0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e);
    // namehash("hexo.eth")
    bytes32 public constant hexoRootNode =
        0xf55a38be8aab2a9e033746f5d0c4af6122e4dc9e896858445fa8e2e46abce36c;

    /// Events

    event PriceChanged(uint256 price);
    event BaseURIChanged(string baseURI);
    event TokenURIChanged(uint256 tokenId, string tokenURI);
    event ColorAdded(string color);
    event ObjectAdded(string object);
    event FundsClaimed(uint256 amount, address to);
    event ItemBought(string color, string object, address buyer, uint256 price);

    /// Constructor

    constructor(uint256 _price, string memory _baseURI)
        ERC721("Hexo Codes", "HEXO")
    {
        price = _price;
        baseURI = _baseURI;

        colors[keccak256("red")] = 1;
        colors[keccak256("green")] = 1;
        colors[keccak256("blue")] = 1;

        objects[keccak256("dragon")] = 1;
        objects[keccak256("turtle")] = 1;
        objects[keccak256("penguin")] = 1;
    }

    /// Owner actions

    function changePrice(uint256 _price) external onlyOwner {
        price = _price;
        emit PriceChanged(_price);
    }

    function changeBaseURI(string calldata _baseURI) external onlyOwner {
        baseURI = _baseURI;
        emit BaseURIChanged(_baseURI);
    }

    function addColors(string[] calldata _colors) external onlyOwner {
        for (uint256 i = 0; i < _colors.length; i++) {
            string memory color = _colors[i];
            bytes32 colorHash = keccak256(bytes(color));
            require(colors[colorHash] == 0, "Color already added");
            colors[colorHash] = 1;
            emit ColorAdded(color);
        }
    }

    function addObjects(string[] calldata _objects) external onlyOwner {
        for (uint256 i = 0; i < _objects.length; i++) {
            string memory object = _objects[i];
            bytes32 objectHash = keccak256(bytes(object));
            require(objects[objectHash] == 0, "Object already added");
            objects[objectHash] = 1;
            emit ObjectAdded(object);
        }
    }

    function claim(address payable _to, uint256 _amount) external onlyOwner {
        _to.sendValue(_amount);
        emit FundsClaimed(_amount, _to);
    }

    /// User actions

    function buy(string[] calldata _colors, string[] calldata _objects)
        external
        payable
    {
        require(_colors.length == _objects.length, "Invalid inputs");
        require(msg.value == price * _colors.length, "Insufficient amount");

        for (uint256 i = 0; i < _colors.length; i++) {
            string memory color = _colors[i];
            string memory object = _objects[i];

            bytes32 colorHash = keccak256(bytes(color));
            require(colors[colorHash] == 1, "Color not added");
            bytes32 objectHash = keccak256(bytes(object));
            require(objects[objectHash] == 1, "Object not added");

            bytes memory hexoName = abi.encodePacked(color, object);
            bytes32 hexoLabel = keccak256(hexoName);

            uint256 tokenId = uint256(hexoLabel);
            tokenIdToHexoLabel[tokenId] = hexoLabel;
            _safeMint(msg.sender, tokenId);

            emit ItemBought(color, object, msg.sender, price);
        }
    }

    function setTokenURI(uint256 _tokenId, string calldata _tokenURI) external {
        require(ownerOf(_tokenId) == msg.sender, "Unauthorized");
        tokenURIs[_tokenId] = _tokenURI;
        emit TokenURIChanged(_tokenId, _tokenURI);
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
