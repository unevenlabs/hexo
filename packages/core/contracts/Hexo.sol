// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "base64-sol/base64.sol";

import "./interfaces/IAddrResolver.sol";
import "./interfaces/IENS.sol";

contract Hexo is ERC721, Ownable {
    using Address for address payable;
    using Strings for uint256;

    /// Structs

    struct TokenInfo {
        string color;
        string object;
        uint8 generation;
    }

    /// Fields

    uint256 public price;
    // For gas efficiency, first generation is 0
    uint8 public generation;

    string public baseImageURI;
    // Mapping from token id to custom image URI (if any)
    mapping(uint256 => string) public customImageURIs;

    // Keep track of available colors and objects
    mapping(bytes32 => bool) public colors;
    mapping(bytes32 => bool) public objects;

    // Mapping from token id to token info (eg. color, object, generation)
    mapping(uint256 => TokenInfo) public tokenInfos;

    /// Constants

    address public constant ensRegistry =
        address(0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e);
    address public constant ensPublicResolver =
        address(0xf6305c19e814d2a75429Fd637d01F7ee0E77d615);

    // namehash("hexo.eth")
    bytes32 public constant rootNode =
        0xf55a38be8aab2a9e033746f5d0c4af6122e4dc9e896858445fa8e2e46abce36c;

    /// Events

    event PriceChanged(uint256 price);
    event GenerationIncremented(uint256 generation);
    event BaseImageURIChanged(string baseImageURI);
    event ColorsAdded(bytes32[] colorHashes);
    event ObjectsAdded(bytes32[] objectHashes);
    event ProfitsPulled(uint256 amount, address indexed to);

    event ItemBought(
        uint256 indexed tokenId,
        string color,
        string object,
        uint8 generation,
        address indexed buyer,
        uint256 price
    );
    event ENSSubdomainClaimed(
        uint256 indexed tokenId,
        string color,
        string object,
        address indexed claimer
    );
    event CustomImageURISet(uint256 indexed tokenId, string customImageURI);

    /// Constructor

    constructor(uint256 price_, string memory baseImageURI_)
        ERC721("Hexo Codes", "HEXO")
    {
        price = price_;
        baseImageURI = baseImageURI_;
    }

    /// Owner actions

    function changePrice(uint256 price_) external onlyOwner {
        price = price_;
        emit PriceChanged(price_);
    }

    function incrementGeneration() external onlyOwner {
        generation++;
        emit GenerationIncremented(generation);
    }

    function changeBaseImageURI(string calldata baseImageURI_)
        external
        onlyOwner
    {
        baseImageURI = baseImageURI_;
        emit BaseImageURIChanged(baseImageURI_);
    }

    function addColors(bytes32[] calldata _colorHashes) external onlyOwner {
        for (uint256 i = 0; i < _colorHashes.length; i++) {
            colors[_colorHashes[i]] = true;
        }
        emit ColorsAdded(_colorHashes);
    }

    function addObjects(bytes32[] calldata _objectHashes) external onlyOwner {
        for (uint256 i = 0; i < _objectHashes.length; i++) {
            objects[_objectHashes[i]] = true;
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
            require(colors[keccak256(bytes(_colors[i]))], "Color not added");
            require(objects[keccak256(bytes(_objects[i]))], "Object not added");

            string memory name = string(
                abi.encodePacked(_colors[i], _objects[i])
            );
            uint256 tokenId = uint256(keccak256(bytes(name)));

            TokenInfo storage tokenInfo = tokenInfos[tokenId];
            tokenInfo.color = _colors[i];
            tokenInfo.object = _objects[i];
            tokenInfo.generation = generation;

            _safeMint(msg.sender, tokenId);

            emit ItemBought(
                tokenId,
                _colors[i],
                _objects[i],
                generation,
                msg.sender,
                price
            );
        }
    }

    function claimENSSubdomains(
        string[] calldata _colors,
        string[] calldata _objects
    ) external {
        require(_colors.length == _objects.length, "Invalid input");

        uint256 numItems = _colors.length;
        for (uint256 i = 0; i < numItems; i++) {
            bytes32 label = keccak256(
                abi.encodePacked(_colors[i], _objects[i])
            );
            uint256 tokenId = uint256(label);
            require(msg.sender == ownerOf(tokenId), "Unauthorized");

            // Temporarily set this contract as the owner of the ENS subdomain,
            // giving it permission to set up ENS forward resolution
            IENS(ensRegistry).setSubnodeRecord(
                rootNode,
                label,
                address(this),
                ensPublicResolver,
                0
            );

            // Set up ENS forward resolution to point to the owner
            IAddrResolver(ensPublicResolver).setAddr(
                keccak256(abi.encodePacked(rootNode, label)),
                msg.sender
            );

            // Give ownership back to the proper owner
            IENS(ensRegistry).setSubnodeOwner(rootNode, label, msg.sender);

            emit ENSSubdomainClaimed(
                tokenId,
                _colors[i],
                _objects[i],
                msg.sender
            );
        }
    }

    function setCustomImageURI(
        uint256 _tokenId,
        string calldata _customImageURI
    ) external {
        require(msg.sender == ownerOf(_tokenId), "Unauthorized");
        customImageURIs[_tokenId] = _customImageURI;
        emit CustomImageURISet(_tokenId, _customImageURI);
    }

    /// Views

    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory metadata)
    {
        require(_exists(_tokenId), "Inexistent token");

        TokenInfo storage tokenInfo = tokenInfos[_tokenId];
        string memory tokenColor = _capitalize(tokenInfo.color);
        string memory tokenObject = _capitalize(tokenInfo.object);
        uint256 tokenGeneration = tokenInfo.generation + 1;

        // Name
        metadata = string(
            abi.encodePacked(
                '{\n  "name": "',
                tokenColor,
                " ",
                tokenObject,
                '",\n'
            )
        );

        // Description
        metadata = string(
            abi.encodePacked(
                metadata,
                '  "description": "Unique combos of basic colors and objects that form universally recognizable NFT identities. Visit hexo.codes to learn more.",\n'
            )
        );

        // Image
        metadata = string(
            abi.encodePacked(
                metadata,
                '  "image": "',
                imageURI(_tokenId),
                '",\n'
            )
        );

        // Attributes
        metadata = string(abi.encodePacked(metadata, '  "attributes": [\n'));
        metadata = string(
            abi.encodePacked(
                metadata,
                '    {\n      "trait_type": "Color",\n      "value": "',
                tokenColor,
                '"\n',
                "    },\n"
            )
        );
        metadata = string(
            abi.encodePacked(
                metadata,
                '    {\n      "trait_type": "Object",\n      "value": "',
                tokenObject,
                '"\n',
                "    },\n"
            )
        );
        metadata = string(
            abi.encodePacked(
                metadata,
                '    {\n      "display_type": "number",\n      "trait_type": "Generation",\n      "value": ',
                tokenGeneration.toString(),
                "\n",
                "    }\n"
            )
        );
        metadata = string(abi.encodePacked(metadata, "  ]\n}"));

        // Return a data URI of the metadata
        metadata = string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(bytes(metadata))
            )
        );
    }

    function contractURI() external pure returns (string memory metadata) {
        // Name
        metadata = string(abi.encodePacked('{\n  "name": "Hexo Codes",\n'));

        // Description
        metadata = string(
            abi.encodePacked(
                metadata,
                '  "description": "Unique combos of basic colors and objects that form universally recognizable NFT identities. Visit hexo.codes to learn more.",\n'
            )
        );

        // Image
        metadata = string(
            abi.encodePacked(
                metadata,
                '  "image": "https://hexo.codes/logo.svg",\n'
            )
        );

        // External link
        metadata = string(
            abi.encodePacked(
                metadata,
                '  "external_link": "https://hexo.codes"\n'
            )
        );

        metadata = string(abi.encodePacked(metadata, "\n}"));

        // Return a data URI of the metadata
        metadata = string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(bytes(metadata))
            )
        );
    }

    function imageURI(uint256 _tokenId)
        public
        view
        returns (string memory uri)
    {
        require(_exists(_tokenId), "Inexistent token");

        uri = customImageURIs[_tokenId];
        if (bytes(uri).length == 0) {
            // If a custom image URI is not set, use the default
            uri = string(abi.encodePacked(baseImageURI, _tokenId.toString()));
        }
    }

    /// Internals

    function _capitalize(string memory _string)
        internal
        pure
        returns (string memory)
    {
        bytes memory _bytes = bytes(_string);
        if (_bytes[0] >= 0x61 && _bytes[0] <= 0x7A) {
            _bytes[0] = bytes1(uint8(_bytes[0]) - 32);
        }
        return string(_bytes);
    }
}
