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
    ERC20Permit public veToken;

    // ADD NEW: Maximum staking duration for full $veSONYA accrual (4 years)
    uint256 public constant MAX_VE_DURATION = 4 * 365 days;

    // Mapping to track staked balances for each user.
    mapping(address => uint256) public stakes;

    // NEW: Total amount staked by all users.
    uint256 public totalStaked;

    // ADD NEW: Mapping to track the last timestamp used for ve reward accumulation per user
    mapping(address => uint256) public lastVeClaim;

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

    // ADD NEW: Event emitted when veSONYA rewards are claimed
    event VeRewardsClaimed(address indexed staker, uint256 rewards);

    /**
     * @notice Constructor sets the token and initializes the rewards system.
     * @param _token The ERC20Permit token used for staking.
     * @param _veToken The ERC20Permit token used for $veSONYA rewards.
     */
    constructor(ERC20Permit _token, ERC20Permit _veToken) Ownable(msg.sender) {
        token = _token;
        veToken = _veToken;
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

        updateReward(msg.sender);

        stakes[msg.sender] += amount;
        totalStaked += amount;

        token.permit(msg.sender, address(this), amount, deadline, v, r, s);
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

    /**
     * @notice Claim rewards based on the time elapsed since the last update and the staked amount.
     */
    function claimRewards() external nonReentrant {
        updateReward(msg.sender);
        uint256 reward = rewards[msg.sender];
        require(reward > 0, "No rewards to claim");

        rewards[msg.sender] = 0;
        totalReleasedRewards += reward;
        require(totalReleasedRewards <= TOTAL_REWARDS, "Total rewards exceeded");

        token.safeTransfer(msg.sender, reward);

        emit RewardsClaimed(msg.sender, reward);
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

    function claimVeRewards() external nonReentrant {
        uint256 stakedAmount = stakes[msg.sender];
        require(stakedAmount > 0, "No stake found");

        uint256 timeElapsed = block.timestamp - lastVeClaim[msg.sender];
        if (timeElapsed > MAX_VE_DURATION) {
            timeElapsed = MAX_VE_DURATION;
        }
        uint256 veRewards = (stakedAmount * timeElapsed) / MAX_VE_DURATION;
        require(veRewards > 0, "No ve rewards to claim");

        // Reset accumulation time on claim.
        lastVeClaim[msg.sender] = block.timestamp;
        veToken.safeTransfer(msg.sender, veRewards);
        
        emit VeRewardsClaimed(msg.sender, veRewards);
    }
}