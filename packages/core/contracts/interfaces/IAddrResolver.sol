// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IAddrResolver {
    function setAddr(bytes32 node, address a) external;

    function addr(bytes32 node) external view returns (address);
}
