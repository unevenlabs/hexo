// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IENS {
    function setOwner(bytes32 node, address owner) external;

    function setResolver(bytes32 node, address resolver) external;

    function setSubnodeRecord(
        bytes32 node,
        bytes32 label,
        address owner,
        address resolver,
        uint64 ttl
    ) external;

    function setSubnodeOwner(
        bytes32 node,
        bytes32 label,
        address owner
    ) external returns (bytes32);

    function owner(bytes32 node) external view returns (address);

    function resolver(bytes32 node) external view returns (address);
}
