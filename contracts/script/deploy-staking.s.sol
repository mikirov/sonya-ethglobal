// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "forge-std/Script.sol";
import { Staking } from "../src/Staking.sol";
import { console2 } from "forge-std/console2.sol";

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract DeployStaking is Script {
    function run() external {
        // Load environment variables
        string memory rpcUrl = vm.envString("RPC_URL");
        string memory privateKey = vm.envString("PRIVATE_KEY");

        // Set the RPC URL and account for broadcasting
        vm.setEnv("RPC_URL", rpcUrl);
        vm.setEnv("PRIVATE_KEY", privateKey);

        // Start broadcasting transactions
        vm.startBroadcast();

        // Instantiate the token contract (replace with your token address)
        ERC20Permit token = ERC20Permit(0x7Bcbc36f7c4D5175B13Dfb789A3C360381D2F14D);

        address rSonyaTokenAddress = vm.envAddress("RSONYATOKEN_ADDRESS");

        // Create an instance of the veSONYA token.
        ERC20Permit rSonyaToken = ERC20Permit(rSonyaTokenAddress);
        
        // Deploy the Staking contract (non-upgradable) with the token as parameter
        Staking staking = new Staking(token, rSonyaToken);

        // Log the deployed contract address, token address, and chain ID
        console2.log("Deployed Staking Contract at address:", address(staking));

        vm.stopBroadcast();
    }
} 