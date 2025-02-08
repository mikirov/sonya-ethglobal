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

    // ADD NEW: ve token for $veSONYA rewards
    ERC20Permit public rewardToken;

    // Mapping to track staked balances for each user.
    mapping(address => uint256) public stakes;

    // NEW: Total amount staked by all users.
    uint256 public totalStaked;

    // Total rewards available for distribution.
    uint256 public constant TOTAL_REWARDS = 2_500_000 * 10**18;
    uint256 public totalReleasedRewards;
    // Timestamp for the last rewards update.
    uint256 public lastUpdateTime;

    // NEW: Reward rate (total rewards per second distributed to the pool)
    // Note: We assume rewards are distributed linearly over a fixed period.
    uint256 public rewardsRate;

    // NEW: Reward distribution variables.
    // rewardPerTokenStored is the global accumulator (scaled by 1e18)
    uint256 public rewardPerTokenStored;
    // For each user, tracks the reward per token that has already been credited.
    mapping(address => uint256) public userRewardPerTokenPaid;
    // Accrued rewards for each user.
    mapping(address => uint256) public rewards;

    event Staked(address indexed staker, uint256 amount);
    event Unstaked(address indexed staker, uint256 amount);
    event RewardsClaimed(address indexed staker, uint256 rewards);
    event Withdrawn(address indexed owner, uint256 amount);

    /**
     * @notice Constructor sets the token and initializes the rewards system.
     * @param _token The ERC20Permit token used for staking.
     * @param _rewardToken The ERC20Permit token used for $veSONYA rewards.
     */
    constructor(ERC20Permit _token, ERC20Permit _rewardToken) Ownable(msg.sender) {
        token = _token;
        rewardToken = _rewardToken;
        rewardsRate = TOTAL_REWARDS / (10 * 365 days); // Adjust the distribution period as needed.
        lastUpdateTime = block.timestamp;
    }

    /**
     * @notice Stake tokens without permit support. (requires prior approval)
     * @param amount The amount of tokens to stake.
     */
    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");

        // Update rewards for the sender.
        updateReward(msg.sender);

        // Update the stake balance.
        stakes[msg.sender] += amount;
        totalStaked += amount;

        // Transfer tokens from the sender.
        token.safeTransferFrom(msg.sender, address(this), amount);

        emit Staked(msg.sender, amount);
    }

    /**
     * @notice Unstake tokens.
     * @param amount The amount of tokens to unstake.
     */
    function unstake(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        require(stakes[msg.sender] >= amount, "Insufficient stake");

        updateReward(msg.sender);

        stakes[msg.sender] -= amount;
        totalStaked -= amount;

        token.safeTransfer(msg.sender, amount);

        emit Unstaked(msg.sender, amount);
    }

    // NEW: Computes the current reward per token.
    function rewardPerToken() public view returns (uint256) {
        if (totalStaked == 0) {
            return rewardPerTokenStored;
        }
        return rewardPerTokenStored + ((block.timestamp - lastUpdateTime) * rewardsRate * 1e18) / totalStaked;
    }

    // NEW: Returns the earned reward for an account.
    function earned(address account) public view returns (uint256) {
        return (stakes[account] * (rewardPerToken() - userRewardPerTokenPaid[account])) / 1e18 + rewards[account];
    }

    // NEW: Internal function to update the reward accounting.
    function updateReward(address account) internal {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
    }
    function claimRewards() external nonReentrant {
        // Update the reward accounting for the sender.
        updateReward(msg.sender);
        
        // Get the total rewards accrued for the sender.
        uint256 rewardAmount = rewards[msg.sender];
        require(rewardAmount > 0, "No rewards to claim");
        
        // Reset the accrued rewards.
        rewards[msg.sender] = 0;
        
        // Transfer the rewardToken (the reward token used for rewards) to the sender.
        rewardToken.safeTransfer(msg.sender, rewardAmount);
        
        // Emit the event for a successful reward claim.
        emit RewardsClaimed(msg.sender, rewardAmount);
    }

    // function setRewardsDuration(uint256 _duration) external onlyOwner {
    //     require(finishAt < block.timestamp, "reward duration not finished");
    //     duration = _duration;
    // }

    // function notifyRewardAmount(uint256 _amount)
    //     external
    //     onlyOwner
    //     updateReward(address(0))
    // {
    //     if (block.timestamp >= finishAt) {
    //         rewardRate = _amount / duration;
    //     } else {
    //         uint256 remainingRewards = (finishAt - block.timestamp) * rewardRate;
    //         rewardRate = (_amount + remainingRewards) / duration;
    //     }

    //     require(rewardRate > 0, "reward rate = 0");
    //     require(
    //         rewardRate * duration <= rewardsToken.balanceOf(address(this)),
    //         "reward amount > balance"
    //     );

    //     finishAt = block.timestamp + duration;
    //     updatedAt = block.timestamp;
    // }
}