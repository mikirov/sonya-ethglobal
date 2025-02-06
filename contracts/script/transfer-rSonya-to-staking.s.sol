// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "forge-std/Script.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import { console2 } from "forge-std/console2.sol";

contract TransferVeSonyaToStaking is Script {
    function run() public {
        // Retrieve the Staking contract address and the veSONYA token address from environment variables.
        address stakingAddress = vm.envAddress("STAKING_CONTRACT_ADDRESS");
        address rSonyaTokenAddress = vm.envAddress("RSONYATOKEN_ADDRESS");

        // Create an instance of the veSONYA token.
        IERC20 rSonyaToken = IERC20(rSonyaTokenAddress);
        
        // Define the amount to transfer: here we transfer 1,000,000 veSONYA tokens (assuming 18 decimals).
        uint256 amount = 2_500_000 * 10**18;
        
        // Start broadcasting the transaction.
        vm.startBroadcast();

        // Transfer veSONYA tokens to the Staking contract.
        rSonyaToken.transfer(stakingAddress, amount);

        console2.log("Transferred 2,500,000 rSONYA tokens to the Staking contract.");

        // Stop broadcasting the transaction.
        vm.stopBroadcast();
    }
} 