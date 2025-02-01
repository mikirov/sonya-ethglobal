// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

import "./interface/IVesting.sol";

/**
 * @title Vesting Contract
 * @dev This contract allows the vesting of tokens over time for beneficiaries.
 *      It includes functions to add beneficiaries, release vested tokens, and a withdraw
 *      function restricted to the contract owner. This contract is non-upgradable.
 */
contract Vesting is IVesting, ReentrancyGuard, Ownable {
    using SafeERC20 for ERC20Permit;

    mapping(address => Beneficiary) public beneficiaries;
    ERC20Permit public token;

    event TokensReleased(address indexed beneficiary, uint256 amount);

    /**
     * @notice Constructor sets the token and initializes the vesting contract.
     * @param _token The ERC20Permit token used for vesting.
     */
    constructor(ERC20Permit _token) Ownable(msg.sender) {
        token = _token;
    }

    /**
     * @notice Adds a beneficiary with vesting rules.
     * @param beneficiary The address of the beneficiary.
     * @param totalAllocation The total tokens allocated to the beneficiary.
     * @param cliffDuration The cliff duration in seconds.
     * @param vestingDuration The total vesting duration in seconds.
     * @dev Only the owner can call this function.
     */
    function addBeneficiary(
        address beneficiary,
        uint256 totalAllocation,
        uint256 cliffDuration, // in seconds
        uint256 vestingDuration // in seconds
    ) external onlyOwner {
        require(beneficiaries[beneficiary].totalAllocation == 0, "Beneficiary already exists");
        require(totalAllocation > 0, "Allocation must be greater than 0");

        beneficiaries[beneficiary] = Beneficiary({
            totalAllocation: totalAllocation,
            released: 0,
            start: block.timestamp,
            cliff: cliffDuration,
            duration: vestingDuration
        });
    }

    /**
     * @notice Releases tokens to the beneficiary.
     * @dev Calculates the releasable tokens and transfers them.
     */
    function release() external nonReentrant {
        Beneficiary storage beneficiary = beneficiaries[msg.sender];
        require(beneficiary.totalAllocation > 0, "No tokens to release");

        uint256 unreleased = _releasableAmount(beneficiary);
        require(unreleased > 0, "No tokens are due");

        beneficiary.released += unreleased;
        token.safeTransfer(msg.sender, unreleased);

        emit TokensReleased(msg.sender, unreleased);
    }

    /**
     * @dev Calculates the releasable amount based on vesting rules.
     * @param beneficiary The beneficiary structure.
     * @return The amount of tokens that can be released.
     */
    function _releasableAmount(Beneficiary memory beneficiary) internal view returns (uint256) {
        if (block.timestamp < beneficiary.start + beneficiary.cliff) {
            return 0; // Cliff not reached
        } else if (block.timestamp >= beneficiary.start + beneficiary.duration) {
            return beneficiary.totalAllocation - beneficiary.released; // All tokens are releasable
        } else {
            uint256 elapsedTime = block.timestamp - beneficiary.start - beneficiary.cliff;
            uint256 totalVestingTime = beneficiary.duration - beneficiary.cliff;
            uint256 vestedAmount = (beneficiary.totalAllocation * elapsedTime) / totalVestingTime;
            return vestedAmount - beneficiary.released; // Vested amount minus already released tokens
        }
    }

    /**
     * @notice Retrieves details about a specific beneficiary.
     * @param beneficiary The address of the beneficiary.
     * @return totalAllocation Total tokens allocated to the beneficiary.
     * @return released Tokens released to the beneficiary.
     * @return start Start time of the vesting period.
     * @return cliff Cliff duration in seconds.
     * @return duration Total vesting duration in seconds.
     */
    function getBeneficiaryDetails(address beneficiary) external view returns (
        uint256 totalAllocation,
        uint256 released,
        uint256 start,
        uint256 cliff,
        uint256 duration
    ) {
        Beneficiary memory b = beneficiaries[beneficiary];
        return (b.totalAllocation, b.released, b.start, b.cliff, b.duration);
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
    }
}