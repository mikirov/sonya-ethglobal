// scripts/deploy.s.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "forge-std/Script.sol";
import {usdSonyaToken} from "../src/usdSonyaToken.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DeploySonyaToken is Script {
    function run() external {
        // Load environment variables
        string memory rpcUrl = vm.envString("RPC_URL");
        string memory privateKey = vm.envString("PRIVATE_KEY");

        // Set the RPC URL and account for the broadcast
        vm.setEnv("RPC_URL", rpcUrl);
        vm.setEnv("PRIVATE_KEY", privateKey);

        vm.startBroadcast();

        // Deploy the HistoriToken
        usdSonyaToken token = new usdSonyaToken();

        vm.stopBroadcast();

        // Log the deployed token address and the chain ID
        console.log("Deployed $usdSonyaToken at address:", address(token));
    }
}
