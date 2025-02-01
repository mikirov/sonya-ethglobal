// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/**
 * @title Deposit Contract
 * @dev This contract allows users to stake tokens and earn rewards based on their stake.
 *      It includes functions for staking (with permit support), unstaking, claiming rewards,
 *      and a withdraw function that is restricted to the contract owner.
 *      This contract is non-upgradable.
 */
contract Staking is ReentrancyGuard, Ownable {
    using SafeERC20 for ERC20Permit;

    ERC20Permit public token;

    // Mapping to track staked balances for each user.
    mapping(address => uint256) public stakes;

    // Total rewards available for distribution.
    uint256 public constant TOTAL_REWARDS = 2_500_000 * 10**18;
    uint256 public totalReleasedRewards;
    // Timestamp for the last rewards update.
    uint256 public lastUpdateTime;
    // Rewards rate (calculated as total rewards over a fixed period).
    uint256 public rewardsRate;

    event Staked(address indexed staker, uint256 amount);
    event Unstaked(address indexed staker, uint256 amount);
    event RewardsClaimed(address indexed staker, uint256 rewards);
    event Withdrawn(address indexed owner, uint256 amount);

    /**
     * @notice Constructor sets the token and initializes the rewards system.
     * @param _token The ERC20Permit token used for staking.
     */
    constructor(ERC20Permit _token) Ownable(msg.sender) {
        token = _token;
        rewardsRate = TOTAL_REWARDS / (10 * 365 days);
        lastUpdateTime = block.timestamp;
    }

    /**
     * @notice Stake tokens without permit support. (requires prior approval)
     * @param amount The amount of tokens to stake.
     */
    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");

        // Update the stake balance for the sender.
        stakes[msg.sender] += amount;

        // Transfer tokens from the sender to the contract.
        token.safeTransferFrom(msg.sender, address(this), amount);

        emit Staked(msg.sender, amount);
    }

    /**
     * @notice Stake tokens with permit support.
     * @param amount The amount of tokens to stake.
     * @param deadline The deadline timestamp for the permit.
     * @param v The v component of the permit signature.
     * @param r The r component of the permit signature.
     * @param s The s component of the permit signature.
     */
    function stakeWithPermit(
        uint256 amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");

        // Update the stake balance for the sender.
        stakes[msg.sender] += amount;

        // Use permit to approve the transfer and then transfer tokens to the contract.
        token.permit(msg.sender, address(this), amount, deadline, v, r, s);
        token.safeTransferFrom(msg.sender, address(this), amount);

        emit Staked(msg.sender, amount);
    }

    /**
     * @notice Unstake tokens.
     * @param amount The amount of tokens to unstake.
     */
    function unstake(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(stakes[msg.sender] >= amount, "Insufficient stake");

        stakes[msg.sender] -= amount;
        token.safeTransfer(msg.sender, amount);

        emit Unstaked(msg.sender, amount);
    }

    /**
     * @notice Claim rewards based on the time elapsed since the last update and the staked amount.
     */
    function claimRewards() external nonReentrant {
        uint256 rewards = calculateRewards(msg.sender);
        require(rewards > 0, "No rewards to claim");

        totalReleasedRewards += rewards;
        require(totalReleasedRewards <= TOTAL_REWARDS, "Total rewards exceeded");

        token.safeTransfer(msg.sender, rewards);
        lastUpdateTime = block.timestamp;

        emit RewardsClaimed(msg.sender, rewards);
    }

    /**
     * @dev Calculate rewards for a user based on their stake and time elapsed.
     * @param user The address of the staker.
     * @return The reward amount.
     */
    function calculateRewards(address user) internal view returns (uint256) {
        uint256 stakedAmount = stakes[user];
        if (stakedAmount == 0) return 0;

        uint256 timeElapsed = block.timestamp - lastUpdateTime;
        return (stakedAmount * rewardsRate * timeElapsed) / 10**18;
    }

    /**
     * @notice Withdraw tokens from the contract.
     * @param amount The amount of tokens to withdraw.
     * @dev Only the contract owner can call this function.
     */
    function withdraw(uint256 amount) external onlyOwner nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= token.balanceOf(address(this)), "Insufficient contract balance");

        token.safeTransfer(msg.sender, amount);

        emit Withdrawn(msg.sender, amount);
    }
}