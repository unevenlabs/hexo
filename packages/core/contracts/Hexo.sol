// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

import "./interfaces/IAddrResolver.sol";
import "./interfaces/IENS.sol";

contract Hexo is ERC721, Ownable {
    using Address for address payable;

    /// Fields

    uint256 public price;
    bytes32 public colorsMerkleRoot;
    bytes32 public objectsMerkleRoot;
    mapping(uint256 => bytes32) public tokenIdToHexoLabel;

    string private baseURI;
    mapping(uint256 => string) private tokenURIs;

    address public constant ensRegistry =
        address(0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e);
    address public constant ensPublicResolver =
        address(0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41);

    // namehash("hexo.eth")
    bytes32 public constant hexoRootNode =
        0xf55a38be8aab2a9e033746f5d0c4af6122e4dc9e896858445fa8e2e46abce36c;

    /// Events

    event PriceChanged(uint256 price);
    event BaseURIChanged(string baseURI);
    event TokenURIChanged(uint256 tokenId, string tokenURI);
    event ColorsMerkleRootChanged(bytes32 colorsMerkleRoot);
    event ObjectsMerkleRootChanged(bytes32 objectsMerkleRoot);
    event FundsClaimed(uint256 amount, address to);
    event ItemBought(string color, string object, address buyer, uint256 price);

    /// Constructor

    constructor(
        bytes32 _colorsMerkleRoot,
        bytes32 _objectsMerkleRoot,
        uint256 _price,
        string memory _baseURI
    ) ERC721("Hexo Codes", "HEXO") {
        colorsMerkleRoot = _colorsMerkleRoot;
        objectsMerkleRoot = _objectsMerkleRoot;

        price = _price;
        baseURI = _baseURI;
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

    function changeColorsMerkleRoot(bytes32 _colorsMerkleRoot)
        external
        onlyOwner
    {
        colorsMerkleRoot = _colorsMerkleRoot;
        emit ColorsMerkleRootChanged(_colorsMerkleRoot);
    }

    function changeObjectsMerkleRoot(bytes32 _objectsMerkleRoot)
        external
        onlyOwner
    {
        objectsMerkleRoot = _objectsMerkleRoot;
        emit ObjectsMerkleRootChanged(_objectsMerkleRoot);
    }

    function claim(address payable _to, uint256 _amount) external onlyOwner {
        _to.sendValue(_amount);
        emit FundsClaimed(_amount, _to);
    }

    /// User actions

    function buy(
        string[] calldata _colors,
        bytes32[][] calldata _colorProofs,
        string[] calldata _objects,
        bytes32[][] calldata _objectProofs
    ) external payable {
        require(_colors.length == _colorProofs.length, "Invalid input");
        require(_objects.length == _objectProofs.length, "Invalid input");
        require(_colors.length == _objects.length, "Invalid input");

        uint256 numItems = _colors.length;
        require(msg.value == price * numItems, "Insufficient amount");

        for (uint256 i = 0; i < numItems; i++) {
            string memory color = _colors[i];
            require(
                MerkleProof.verify(
                    _colorProofs[i],
                    colorsMerkleRoot,
                    keccak256(bytes(color))
                ),
                "Invalid color proof"
            );

            string memory object = _objects[i];
            require(
                MerkleProof.verify(
                    _objectProofs[i],
                    objectsMerkleRoot,
                    keccak256(bytes(object))
                ),
                "Invalid object proof"
            );

            bytes32 hexoLabel = keccak256(abi.encodePacked(color, object));
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
            _to
        );
        // Give hexo subdomain ownership to the transfer recipient
        IENS(ensRegistry).setSubnodeOwner(hexoRootNode, hexoLabel, _to);
    }
}
