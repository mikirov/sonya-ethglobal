// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "forge-std/Script.sol";
import { Schedule } from "../src/Schedule.sol";
import { console2 } from "forge-std/console2.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DeployScheduler is Script {
    function run() external {
        // Load environment variables
        string memory rpcUrl = vm.envString("RPC_URL");
        string memory privateKey = vm.envString("PRIVATE_KEY");

        // Set the RPC URL and account for broadcasting
        vm.setEnv("RPC_URL", rpcUrl);
        vm.setEnv("PRIVATE_KEY", privateKey);

        // Start broadcasting transactions
        vm.startBroadcast();

        // Retrieve the token addresses from the environment
        address usdSonyaTokenAddress = vm.envAddress("USDSONYATOKEN_ADDRESS");
        address rSonyaTokenAddress = vm.envAddress("RSONYATOKEN_ADDRESS");

        // Instantiate the tokens as IERC20 interfaces
        IERC20 usdSonyaToken = IERC20(usdSonyaTokenAddress);
        IERC20 rSonyaToken = IERC20(rSonyaTokenAddress);

        // Deploy the Schedule contract with the two tokens
        Schedule scheduler = new Schedule(usdSonyaToken, rSonyaToken);

        // Log the deployed contract address
        console2.log("Deployed Schedule Contract at address:", address(scheduler));

        vm.stopBroadcast();
    }
} 