// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import the ERC20 interface and SafeERC20 library from OpenZeppelin
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title Marketplace
 * @notice A simple market contract that accepts USDC or USDT deposits.
 * When a user deposits at least $50 (in token units), it emits an event and rewards the sender with 2 Sonya tokens.
 *
 * Note: This example assumes that both USDC and USDT use 6 decimals.
 * The Sonya token is assumed to have 18 decimals.
 */
contract Marketplace is Ownable, Pausable {
    using SafeERC20 for IERC20;

    // The two allowed tokens: USDC and USDT.
    IERC20 public usdc;
    IERC20 public usdt;
    // The bonus token – Sonya Token.
    IERC20 public usdSonyaToken;

    // Threshold amounts in smallest token units (i.e. 50 * 10^6 for tokens with 6 decimals)
    uint256 public constant THRESHOLD_USDC = 50 * 10**6;
    uint256 public constant THRESHOLD_USDT = 50 * 10**6;
    // Bonus amount: 2 Sonya tokens (assuming 18 decimals)
    uint256 public constant BONUS_AMOUNT = 2 * 10**18;

    // Event emitted after a successful deposit meeting the threshold.
    event DepositReceived(address indexed sender, address token, uint256 amount);

    /**
     * @notice Sets the addresses for USDC, USDT, and Sonya tokens.
     * @param _usdc The address of the USDC token contract.
     * @param _usdt The address of the USDT token contract.
     * @param _usdSonyaToken The address of the Sonya token contract.
     */
    constructor(address _usdc, address _usdt, address _usdSonyaToken) Ownable(msg.sender) {
        require(_usdc != address(0), "Invalid USDC address");
        require(_usdt != address(0), "Invalid USDT address");
        require(_usdSonyaToken != address(0), "Invalid Sonya token address");

        usdc = IERC20(_usdc);
        usdt = IERC20(_usdt);
        usdSonyaToken = IERC20(_usdSonyaToken);
    }

    /**
     * @notice Deposit USDC into the contract.
     * @param amount The amount of USDC (in smallest units) to deposit.
     *
     * Requirements:
     * - The caller must have approved this contract to spend at least `amount` of USDC.
     * - `amount` must be at least the threshold (i.e. $50).
     * - The contract should hold enough Sonya tokens to reward the sender.
     */
    function depositUSDC(uint256 amount) external whenNotPaused {
        require(amount >= THRESHOLD_USDC, "Deposit amount below $50 threshold");

        // Transfer USDC from the sender to this contract.
        usdc.safeTransferFrom(msg.sender, address(this), amount);

        // Emit the event indicating a deposit was received.
        emit DepositReceived(msg.sender, address(usdc), amount);

        // Transfer bonus Sonya tokens to the depositor.
        usdSonyaToken.safeTransfer(msg.sender, amount * BONUS_AMOUNT);
    }

    /**
     * @notice Deposit USDT into the contract.
     * @param amount The amount of USDT (in smallest units) to deposit.
     *
     * Requirements:
     * - The caller must have approved this contract to spend at least `amount` of USDT.
     * - `amount` must be at least the threshold (i.e. $50).
     * - The contract should hold enough Sonya tokens to reward the sender.
     */
    function depositUSDT(uint256 amount) external whenNotPaused {
        require(amount >= THRESHOLD_USDT, "Deposit amount below $50 threshold");

        // Transfer USDT from the sender to this contract.
        usdt.safeTransferFrom(msg.sender, address(this), amount);

        // Emit the event indicating a deposit was received.
        emit DepositReceived(msg.sender, address(usdt), amount);

        // Transfer bonus Sonya tokens to the depositor.
        usdSonyaToken.safeTransfer(msg.sender, amount * BONUS_AMOUNT);
    }

    /**
     * @notice Withdraw tokens from the contract.
     * @param token The ERC20 token to withdraw.
     * @param amount The amount to withdraw.
     * Only the owner can call this function.
     */
    function withdraw(IERC20 token, uint256 amount) external onlyOwner {
        token.safeTransfer(owner(), amount);
    }

    /**
     * @notice Pause the contract. Prevents deposits.
     * Only the owner can call this function.
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause the contract. Allows deposits.
     * Only the owner can call this function.
     */
    function unpause() external onlyOwner {
        _unpause();
    }
} 