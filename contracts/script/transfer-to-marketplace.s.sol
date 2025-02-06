// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "forge-std/Script.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import { console2 } from "forge-std/console2.sol";
contract TransferToMarketplace is Script {
    function run() public {
        // Retrieve the Marketplace contract address and the usdSONYA token address from environment variables.
        address marketplaceAddress = vm.envAddress("MARKETPLACE_ADDRESS");
        address tokenAddress = vm.envAddress("USDSONYATOKEN_ADDRESS");

        // Create an instance of the usdSONYA token.
        IERC20 token = IERC20(tokenAddress);
        
        // Define the amount to transfer: 1 billion tokens (assuming 18 decimals).
        uint256 amount = 1_000_000_000 * 10**18;
        
        // Start broadcasting the transaction.
        vm.startBroadcast();

        // Transfer 1 billion usdSONYA tokens to the Marketplace contract.
        token.transfer(marketplaceAddress, amount);

        console2.log("Transferred 1 billion usdSONYA tokens to the Marketplace contract.");

        // Stop broadcasting the transaction.
        vm.stopBroadcast();
    }
} 