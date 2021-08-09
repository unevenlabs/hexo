// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IAddrResolver {
    function setAddr(bytes32 _node, address _address) external;

    function addr(bytes32 _node) external view returns (address);
}
