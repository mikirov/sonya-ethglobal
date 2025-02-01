// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SonyaToken
 * @dev ERC20 Token with permit functionality for gasless approvals.
 */
contract SonyaToken is ERC20Permit, Ownable {
    uint256 public constant INITIAL_SUPPLY = 1_000_000_000 * 10 ** 18; // Initial supply of 1 billion tokens

    constructor() ERC20("Sonya AI Token", "$SONYA") ERC20Permit("Sonya AI Token") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY); // Mint initial supply to the contract deployer
    }
}
