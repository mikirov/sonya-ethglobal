// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title rSonyaToken
 * @dev ERC20 Token with permit and governance functionality.
 *      This token uses OpenZeppelin's ERC20Votes extension to support governance features.
 */
contract rSonyaToken is ERC20Permit {
    uint256 public constant INITIAL_SUPPLY = 2_500_000 * 10 ** 18;

    constructor() 
        ERC20("Sonya Staking Reward Token", "$rSONYA")
        ERC20Permit("Sonya Staking Reward Token")
    {
        _mint(msg.sender, INITIAL_SUPPLY); // Mint initial supply to the contract deployer
    }
}
