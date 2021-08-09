// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./LibMetadata.sol";
import "./interfaces/IAddrResolver.sol";
import "./interfaces/IENS.sol";

contract Hexo is ERC721, Ownable {
    using Address for address payable;
    using Strings for uint256;

    /// Fields

    string public baseURI;
    string public baseImageURI;
    uint256 public price;
    mapping(bytes32 => uint256) public colors;
    mapping(bytes32 => uint256) public objects;
    mapping(uint256 => string) public hexoNames;

    mapping(uint256 => string) private imageURIs;

    /// Constants

    address public constant ensRegistry =
        address(0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e);
    address public constant ensPublicResolver =
        address(0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41);

    // namehash("hexo.eth")
    bytes32 public constant hexoRootNode =
        0xf55a38be8aab2a9e033746f5d0c4af6122e4dc9e896858445fa8e2e46abce36c;

    /// Events

    event BaseURIChanged(string baseURI);
    event BaseImageURIChanged(string baseImageURI);
    event PriceChanged(uint256 price);
    event ColorsAdded(bytes32[] colorHashes);
    event ObjectsAdded(bytes32[] objectHashes);
    event ProfitsPulled(uint256 amount, address to);

    event ItemBought(string color, string object, address buyer, uint256 price);
    event SubdomainClaimed(string color, string object, address claimer);

    /// Constructor

    constructor(
        string memory baseURI_,
        string memory baseImageURI_,
        uint256 price_
    ) ERC721("Hexo Codes", "HEXO") {
        baseURI = baseURI_;
        baseImageURI = baseImageURI_;
        price = price_;
    }

    /// Owner actions

    function changeBaseURI(string calldata baseURI_) external onlyOwner {
        baseURI = baseURI_;
        emit BaseURIChanged(baseURI_);
    }

    function changeBaseImageURI(string calldata baseImageURI_)
        external
        onlyOwner
    {
        baseImageURI = baseImageURI_;
        emit BaseImageURIChanged(baseImageURI_);
    }

    function changePrice(uint256 price_) external onlyOwner {
        price = price_;
        emit PriceChanged(price_);
    }

    function addColors(bytes32[] calldata _colorHashes) external onlyOwner {
        for (uint256 i = 0; i < _colorHashes.length; i++) {
            colors[_colorHashes[i]] = 1;
        }
        emit ColorsAdded(_colorHashes);
    }

    function addObjects(bytes32[] calldata _objectHashes) external onlyOwner {
        for (uint256 i = 0; i < _objectHashes.length; i++) {
            objects[_objectHashes[i]] = 1;
        }
        emit ObjectsAdded(_objectHashes);
    }

    function pullProfits(uint256 _amount, address payable _to)
        external
        onlyOwner
    {
        _to.sendValue(_amount);
        emit ProfitsPulled(_amount, _to);
    }

    /// User actions

    function buyItems(string[] calldata _colors, string[] calldata _objects)
        external
        payable
    {
        require(_colors.length == _objects.length, "Invalid input");

        uint256 numItems = _colors.length;
        require(msg.value == price * numItems, "Insufficient amount");

        for (uint256 i = 0; i < numItems; i++) {
            require(
                colors[keccak256(bytes(_colors[i]))] == 1,
                "Color not added"
            );
            require(
                objects[keccak256(bytes(_objects[i]))] == 1,
                "Object not added"
            );

            string memory hexoName = string(
                abi.encodePacked(_colors[i], _objects[i])
            );
            uint256 tokenId = uint256(keccak256(bytes(hexoName)));
            hexoNames[tokenId] = hexoName;

            _safeMint(msg.sender, tokenId);

            emit ItemBought(_colors[i], _objects[i], msg.sender, price);
        }
    }

    function claimSubdomains(
        string[] calldata _colors,
        string[] calldata _objects
    ) external {
        require(_colors.length == _objects.length, "Invalid input");

        uint256 numItems = _colors.length;
        for (uint256 i = 0; i < numItems; i++) {
            bytes32 hexoLabel = keccak256(
                abi.encodePacked(_colors[i], _objects[i])
            );
            require(msg.sender == ownerOf(uint256(hexoLabel)), "Unauthorized");

            // Temporarily set this contract as the owner, giving it permission to set up the resolver
            IENS(ensRegistry).setSubnodeRecord(
                hexoRootNode,
                hexoLabel,
                address(this),
                ensPublicResolver,
                0
            );

            // Set the transfer recipient as the address the hexo subdomain resolves to
            IAddrResolver(ensPublicResolver).setAddr(
                keccak256(abi.encodePacked(hexoRootNode, hexoLabel)),
                msg.sender
            );

            // Give hexo subdomain ownership to the transfer recipient
            IENS(ensRegistry).setSubnodeOwner(
                hexoRootNode,
                hexoLabel,
                msg.sender
            );

            emit SubdomainClaimed(_colors[i], _objects[i], msg.sender);
        }
    }

    function setImageURI(uint256 _tokenId, string calldata imageURI_) external {
        require(msg.sender == ownerOf(_tokenId), "Unauthorized");
        imageURIs[_tokenId] = imageURI_;
    }

    /// Views

    function imageURI(uint256 _tokenId)
        public
        view
        returns (string memory uri)
    {
        require(_exists(_tokenId), "Inexistent token");

        uri = imageURIs[_tokenId];
        if (bytes(uri).length == 0) {
            uri = string(abi.encodePacked(baseImageURI, _tokenId.toString()));
        }
    }

    function metadata(uint256 _tokenId) external view returns (string memory) {
        require(_exists(_tokenId), "Inexistent token");
        return
            LibMetadata.constructMetadata(
                hexoNames[_tokenId],
                imageURI(_tokenId)
            );
    }

    /// Overrides

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }
}
