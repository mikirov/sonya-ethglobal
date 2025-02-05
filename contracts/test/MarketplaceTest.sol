// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/Marketplace.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @notice A minimal ERC20 mock, implementing the essential functions for testing.
contract ERC20Mock is Test, IERC20 {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor(string memory _name, string memory _symbol, uint8 _decimals) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
    }

    function transfer(address recipient, uint256 amount) external override returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        return true;
    }

    function approve(address spender, uint256 amount) external override returns (bool) {
        allowance[msg.sender][spender] = amount;
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) external override returns (bool) {
        require(balanceOf[sender] >= amount, "Insufficient balance");
        require(allowance[sender][msg.sender] >= amount, "Allowance exceeded");
        allowance[sender][msg.sender] -= amount;
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        return true;
    }

    /// @notice Mint tokens to an account (test helper)
    function mint(address account, uint256 amount) external {
        balanceOf[account] += amount;
        totalSupply += amount;
    }
}

/// @notice Tests for the Marketplace contract with bonus Sonya tokens.
contract MarketplaceTest is Test {
    Marketplace public marketplace;
    ERC20Mock public usdc;
    ERC20Mock public usdt;
    ERC20Mock public sonyaToken;
    address public depositor;
    
    // The event as defined in the Marketplace contract.
    event DepositReceived(address indexed sender, address token, uint256 amount);

    // Bonus amount constant is 2 Sonya tokens (assuming 18 decimals)
    uint256 constant BONUS_AMOUNT = 2 * 10**18;

    function setUp() public {
        // Deploy mock tokens for USDC and USDT with 6 decimals.
        usdc = new ERC20Mock("Mock USDC", "mUSDC", 6);
        usdt = new ERC20Mock("Mock USDT", "mUSDT", 6);
        // Deploy Sonya token with 18 decimals.
        sonyaToken = new ERC20Mock("Sonya Token", "SONY", 18);

        // Deploy the Marketplace with the addresses of the tokens.
        // Updated constructor now requires a third address for the Sonya token.
        marketplace = new Marketplace(address(usdc), address(usdt), address(sonyaToken));

        // Set a depositor address (ensure it's non-zero).
        depositor = address(0x123);

        // Mint tokens to the depositor (1000 tokens, in smallest units: 1000 * 10**6).
        usdc.mint(depositor, 1000 * 10**6);
        usdt.mint(depositor, 1000 * 10**6);

        // Fund the Marketplace contract with Sonya tokens for bonus payouts.
        // Mint a large amount to cover bonus token transfers.
        sonyaToken.mint(address(marketplace), 1000 * 10**18);
    }

    function testDepositUSDC_RevertsBelowThreshold() public {
        vm.prank(depositor);
        
        // Approve Marketplace contract to spend USDC.
        usdc.approve(address(marketplace), 100 * 10**6);
        uint256 depositAmount = 40 * 10**6; // Below the 50e6 threshold
        
        vm.expectRevert("Deposit amount below $50 threshold");
        marketplace.depositUSDC(depositAmount);
    }

    function testDepositUSDC_Succeeds() public {
        vm.prank(depositor);
        usdc.approve(address(marketplace), 100 * 10**6);
        uint256 depositAmount = 50 * 10**6; // Equal to threshold
        
        // Expect the DepositReceived event.
        vm.expectEmit(true, false, false, true);
        emit DepositReceived(depositor, address(usdc), depositAmount);
        
        marketplace.depositUSDC(depositAmount);
        
        // Verify that the Marketplace contract now holds the USDC deposit.
        uint256 usdcBalance = usdc.balanceOf(address(marketplace));
        assertEq(usdcBalance, depositAmount);

        // Check that the depositor received 2 Sonya tokens as a bonus.
        uint256 depositorSonyaBalance = sonyaToken.balanceOf(depositor);
        assertEq(depositorSonyaBalance, BONUS_AMOUNT);
    }

    function testDepositUSDT_RevertsBelowThreshold() public {
        vm.prank(depositor);
        usdt.approve(address(marketplace), 100 * 10**6);
        uint256 depositAmount = 40 * 10**6;
        
        vm.expectRevert("Deposit amount below $50 threshold");
        marketplace.depositUSDT(depositAmount);
    }

    function testDepositUSDT_Succeeds() public {
        vm.prank(depositor);
        usdt.approve(address(marketplace), 100 * 10**6);
        uint256 depositAmount = 60 * 10**6;
        
        vm.expectEmit(true, false, false, true);
        emit DepositReceived(depositor, address(usdt), depositAmount);
        
        marketplace.depositUSDT(depositAmount);
        
        // Verify that the Marketplace contract now holds the USDT deposit.
        uint256 usdtBalance = usdt.balanceOf(address(marketplace));
        assertEq(usdtBalance, depositAmount);

        // Check that the depositor received the bonus 2 Sonya tokens.
        uint256 depositorSonyaBalance = sonyaToken.balanceOf(depositor);
        assertEq(depositorSonyaBalance, BONUS_AMOUNT);
    }
} 