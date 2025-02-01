// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "forge-std/Script.sol";
import { Vesting } from "../src/Vesting.sol";
import { console2 } from "forge-std/console2.sol";

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract DeployVesting is Script {
    function run() external {
        // Load environment variables
        string memory rpcUrl = vm.envString("RPC_URL");
        string memory privateKey = vm.envString("PRIVATE_KEY");

        // Set the RPC URL and account for broadcasting
        vm.setEnv("RPC_URL", rpcUrl);
        vm.setEnv("PRIVATE_KEY", privateKey);

        // Start broadcasting transactions
        vm.startBroadcast();

        // Instantiate the token contract address (replace with your token address)
        ERC20Permit token = ERC20Permit(0x31bCEaf326759672bD9C72c6D465bDEEC0C188A8);

        // Deploy the Vesting contract directly (non-upgradable)
        Vesting vesting = new Vesting(token);

        // Log the deployed contract address, token address, and chain ID
        console2.log("Deployed Vesting Contract at address:", address(vesting));
        console2.log("Token address:", address(vesting.token()));
        console2.log("Chain ID:", block.chainid);

        vm.stopBroadcast();
    }
}