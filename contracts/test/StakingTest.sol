// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "./SigUtils.sol";
import "../src/Staking.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract ERC20PermitMock is ERC20Permit {
    constructor() ERC20("MockToken", "MTK") ERC20Permit("MockToken") {
        _mint(msg.sender, 1000000 * 10**18);
    }
}

/**
 * @title StakingTest
 * @notice This contract tests the main flow of the Staking contract.
 */
contract StakingTest is Test {
    Staking public stakingContract;
    ERC20Permit public tokenPermit;
    ERC20Permit public veTokenPermit;

    SigUtils internal sigUtils;

    uint256 internal ownerPrivateKey;
    uint256 internal spenderPrivateKey;

    address internal owner;
    address internal spender;

    event RewardsClaimed(address indexed staker, uint256 rewards);

    function setUp() public {
        // Deploy tokens for staking and rewards
        tokenPermit = new ERC20PermitMock();
        veTokenPermit = new ERC20PermitMock();
        sigUtils = new SigUtils(tokenPermit.DOMAIN_SEPARATOR());

        // Set up two accounts used in tests.
        ownerPrivateKey = 0xA11CE;
        spenderPrivateKey = 0xB0B;

        owner = vm.addr(ownerPrivateKey);
        spender = vm.addr(spenderPrivateKey);

        // Deploy the staking contract.
        stakingContract = new Staking(tokenPermit, veTokenPermit);
        
        // Distribute staking tokens to users.
        tokenPermit.transfer(owner, 1000 * 10**18);
        tokenPermit.transfer(spender, 1000 * 10**18);
    }

    // =========================================================================
    // Existing test: testing signature permit functionality.
    // =========================================================================
    function test_Permit() public {
        SigUtils.Permit memory permit = SigUtils.Permit({
            owner: owner,
            spender: spender,
            value: 1e18,
            nonce: 0,
            deadline: 1 days
        });

        bytes32 digest = sigUtils.getTypedDataHash(permit);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerPrivateKey, digest);

        tokenPermit.permit(
            permit.owner,
            permit.spender,
            permit.value,
            permit.deadline,
            v,
            r,
            s
        );

        assertEq(tokenPermit.allowance(owner, spender), 1e18);
        assertEq(tokenPermit.nonces(owner), 1);
    }

    // =========================================================================
    // New tests for staking, unstaking and claiming rewards.
    // =========================================================================

    /// @notice Test that staking tokens deposits them into the contract.
    function testStake() public {
        uint256 stakeAmount = 100 * 10**18;
        
        // Actions performed by owner.
        vm.prank(owner);
        tokenPermit.approve(address(stakingContract), stakeAmount);

        uint256 ownerBalanceBefore = tokenPermit.balanceOf(owner);

        vm.prank(owner);
        stakingContract.stake(stakeAmount);
        
        // Check that the stake mapping is updated.
        uint256 stakeBalance = stakingContract.stakes(owner);
        assertEq(stakeBalance, stakeAmount);
        
        // Check that totalStaked is updated.
        assertEq(stakingContract.totalStaked(), stakeAmount);
        
        // Check that owner's token balance has decreased by stakeAmount.
        uint256 ownerBalanceAfter = tokenPermit.balanceOf(owner);
        assertEq(ownerBalanceBefore - ownerBalanceAfter, stakeAmount);
        
        // And the staking contract now holds the tokens.
        uint256 contractTokenBalance = tokenPermit.balanceOf(address(stakingContract));
        assertEq(contractTokenBalance, stakeAmount);
    }

    /// @notice Test that staking zero tokens reverts.
    function testStakeZeroShouldRevert() public {
        vm.prank(owner);
        vm.expectRevert("Amount must be greater than 0");
        stakingContract.stake(0);
    }

    /// @notice Test that a user can unstake a portion of their stake.
    function testUnstake() public {
        uint256 stakeAmount = 200 * 10**18;
        uint256 unstakeAmount = 50 * 10**18;

        // Stake tokens as owner.
        vm.prank(owner);
        tokenPermit.approve(address(stakingContract), stakeAmount);
        vm.prank(owner);
        stakingContract.stake(stakeAmount);

        // Unstake some tokens.
        vm.prank(owner);
        stakingContract.unstake(unstakeAmount);

        // Verify that the stake is reduced.
        uint256 remainingStake = stakingContract.stakes(owner);
        assertEq(remainingStake, stakeAmount - unstakeAmount);
        // And totalStaked is updated.
        assertEq(stakingContract.totalStaked(), stakeAmount - unstakeAmount);
    }

    /// @notice Test that attempting to unstake more than the staked amount reverts.
    function testUnstakeExceedsStake() public {
        uint256 stakeAmount = 100 * 10**18;
        uint256 unstakeAmount = 150 * 10**18; // exceeds the stake

        // Stake tokens as owner.
        vm.prank(owner);
        tokenPermit.approve(address(stakingContract), stakeAmount);
        vm.prank(owner);
        stakingContract.stake(stakeAmount);

        // Expect revert when trying to unstake more than deposited.
        vm.prank(owner);
        vm.expectRevert("Insufficient stake");
        stakingContract.unstake(unstakeAmount);
    }

    /// @notice Test that claiming rewards after time passes transfers the correct amount.
    function testClaimRewards() public {
        uint256 stakeAmount = 100 * 10**18;

        // Stake tokens from owner.
        vm.prank(owner);
        tokenPermit.approve(address(stakingContract), stakeAmount);
        vm.prank(owner);
        stakingContract.stake(stakeAmount);

        // Record the block timestamp right after staking.
        uint256 stakeTime = block.timestamp;

        // Advance time by 1,000 seconds.
        uint256 delta = 1000;
        vm.warp(stakeTime + delta);

        // In the Staking contract reward system,
        // expected reward = delta * rewardsRate (when a single staker)
        uint256 rewardRate = stakingContract.rewardsRate();
        uint256 expectedReward = delta * rewardRate;

        // Fund the staking contract with reward tokens so it can pay the reward.
        vm.prank(owner);
        veTokenPermit.transfer(address(stakingContract), expectedReward + 1e18);

        uint256 contractRewardBalanceBefore = veTokenPermit.balanceOf(address(stakingContract));

        // Expect the RewardsClaimed event to be emitted.
        vm.prank(owner);
        vm.expectEmit(true, true, true, true);
        emit RewardsClaimed(owner, expectedReward);
        stakingContract.claimRewards();

        // Verify that the staking contract's reward token balance decreased by the expected amount.
        uint256 contractRewardBalanceAfter = veTokenPermit.balanceOf(address(stakingContract));
        assertEq(contractRewardBalanceBefore - contractRewardBalanceAfter, expectedReward);

        // Also check that the user's rewards in the contract have been reset.
        assertEq(stakingContract.rewards(owner), 0);
    }

    /// @notice Test that calling claimRewards with no accrued rewards reverts.
    function testClaimRewardsNoRewards() public {
        uint256 stakeAmount = 100 * 10**18;

        // Stake tokens as owner.
        vm.prank(owner);
        tokenPermit.approve(address(stakingContract), stakeAmount);
        vm.prank(owner);
        stakingContract.stake(stakeAmount);

        // Without advancing time, there should be no rewards.
        vm.prank(owner);
        vm.expectRevert("No rewards to claim");
        stakingContract.claimRewards();
    }

    /// @notice Test rewards distribution with multiple stakers.
    function testMultipleStakers() public {
        uint256 stakeAmountOwner = 100 * 10**18;
        uint256 stakeAmountSpender = 200 * 10**18;

        // Owner stakes tokens.
        vm.prank(owner);
        tokenPermit.approve(address(stakingContract), stakeAmountOwner);
        vm.prank(owner);
        stakingContract.stake(stakeAmountOwner);

        // Spender stakes tokens.
        vm.prank(spender);
        tokenPermit.approve(address(stakingContract), stakeAmountSpender);
        vm.prank(spender);
        stakingContract.stake(stakeAmountSpender);

        // Total staked should equal the sum of both stakes.
        assertEq(stakingContract.totalStaked(), stakeAmountOwner + stakeAmountSpender);

        // Advance time by 500 seconds.
        uint256 delta = 500;
        uint256 currentTime = block.timestamp;
        vm.warp(currentTime + delta);

        // Fund the staking contract with reward tokens.
        uint256 rewardFund = delta * stakingContract.rewardsRate() + 1e18;
        vm.prank(owner);
        veTokenPermit.transfer(address(stakingContract), rewardFund);

        // Claim rewards for both stakers.
        vm.prank(owner);
        stakingContract.claimRewards();
        vm.prank(spender);
        stakingContract.claimRewards();

        // Verify that the reward mappings for both accounts have been reset.
        assertEq(stakingContract.rewards(owner), 0);
        assertEq(stakingContract.rewards(spender), 0);
    }
}
