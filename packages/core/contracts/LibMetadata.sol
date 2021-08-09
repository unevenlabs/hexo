// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";

library LibMetadata {
    using Strings for uint256;

    function constructMetadata(
        string calldata _hexoName,
        string calldata _imageURI
    ) external pure returns (string memory metadata) {
        // Name
        metadata = string(abi.encodePacked('{\n  "name": "Hexo #', _hexoName));
        metadata = string(abi.encodePacked(metadata, '",\n'));

        // Description
        metadata = string(
            abi.encodePacked(metadata, '  "description": "Generation ')
        );
        metadata = string(abi.encodePacked(metadata, uint256(0).toString()));
        metadata = string(abi.encodePacked(metadata, '",\n'));

        // Image URI
        metadata = string(abi.encodePacked(metadata, '  "image": "'));
        metadata = string(abi.encodePacked(metadata, _imageURI));
        metadata = string(abi.encodePacked(metadata, '"\n}'));
    }
}
