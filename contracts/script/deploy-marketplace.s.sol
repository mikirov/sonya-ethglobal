// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "forge-std/Script.sol";
import { Marketplace } from "../src/Marketplace.sol";
import { console2 } from "forge-std/console2.sol";

contract DeployMarketplace is Script {
    function run() external {
        // Load environment variables for RPC configuration and deployment account.
        string memory rpcUrl = vm.envString("RPC_URL");
        string memory privateKey = vm.envString("PRIVATE_KEY");

        // (Optional) Set these again if needed by your environment configuration.
        vm.setEnv("RPC_URL", rpcUrl);
        vm.setEnv("PRIVATE_KEY", privateKey);

        // Start broadcasting transactions.
        vm.startBroadcast();

        // Provided token addresses:
        // USDC token on Base:
        address usdcAddress = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
        // USDT token on Base:
        address usdtAddress = 0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2;
        // Sonya token (update if your Sonya token address changes):
        address usdSonyaTokenAddress = vm.envAddress("USDSONYATOKEN_ADDRESS");

        // Deploy the Marketplace contract with the three required token addresses.
        Marketplace marketplace = new Marketplace(usdcAddress, usdtAddress, usdSonyaTokenAddress);

        // Log deployment details.
        console2.log("Deployed Marketplace Contract at address:", address(marketplace));

        vm.stopBroadcast();
    }
} 