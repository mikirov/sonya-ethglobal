// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/**
 * @title veSonyaToken
 * @dev ERC20 Token with permit functionality for gasless approvals.
 */
contract usdSonyaToken is ERC20Permit {
    uint256 public constant INITIAL_SUPPLY = 1_000_000_000 * 10 ** 18;

    constructor() ERC20("Sonya USDC Pegged Token", "$usdSONYA") ERC20Permit("Sonya USDC Pegged Token") {
        _mint(msg.sender, INITIAL_SUPPLY); // Mint initial supply to the contract deployer
    }
}
