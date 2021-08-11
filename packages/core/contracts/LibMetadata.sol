// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";

library LibMetadata {
    using Strings for uint256;

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

    function constructMetadata(
        string calldata _color,
        string calldata _object,
        uint256 _generation,
        string calldata _imageURI
    ) external pure returns (string memory metadata) {
        // Name
        metadata = string(
            abi.encodePacked(
                '{\n  "name": "',
                _capitalize(_color),
                " ",
                _capitalize(_object),
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

        // Image URI
        metadata = string(
            abi.encodePacked(metadata, '  "image": "', _imageURI, '",\n')
        );

        // Attributes
        metadata = string(abi.encodePacked(metadata, '  "attributes": [\n'));
        metadata = string(
            abi.encodePacked(
                metadata,
                '    {\n      "trait_type": "Color",\n      "value": "',
                _capitalize(_color),
                '"\n',
                "    },\n"
            )
        );
        metadata = string(
            abi.encodePacked(
                metadata,
                '    {\n      "trait_type": "Object",\n      "value": "',
                _capitalize(_object),
                '"\n',
                "    },\n"
            )
        );
        metadata = string(
            abi.encodePacked(
                metadata,
                '    {\n      "display_type": "number",\n      "trait_type": "Generation",\n      "value": ',
                _generation.toString(),
                "\n",
                "    }\n"
            )
        );
        metadata = string(abi.encodePacked(metadata, "  ]\n}"));
    }
}
