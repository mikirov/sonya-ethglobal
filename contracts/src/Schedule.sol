// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Schedule Contract
 * @dev This contract allows users to schedule an appointment.
 *      When a user calls the schedule() method, the contract pulls 100 usdSONYA tokens
 *      from their wallet and creates an appointment struct with their address, start timestamp, and a duration of 1 hour.
 */
contract Schedule is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // The tokens used for paying for an appointment.
    IERC20 public usdSONYA;
    IERC20 public rSONYA;

    // Cost of scheduling with usdSONYA: 100 usdSONYA tokens.
    uint256 public constant APPOINTMENT_COST = 100 * 10**18;
    // Cost of scheduling with rSONYA: Initially 50 wei rSONYA tokens (modifiable by the owner).
    uint256 public appointmentCostR = 50; // wei

    // Appointment duration is defined to be 1 hour.
    uint32 public constant APPOINTMENT_DURATION = 1 hours;

    // Appointment struct storing appointment details.
    struct Appointment {
        uint32 startTimestamp;
        uint32 duration;
    }

    // Mapping to store each user's appointment.
    mapping(address => Appointment) public appointments;

    // Event emitted when a new appointment is scheduled.
    event AppointmentScheduled(
        uint32 startTimestamp,
        uint32 duration
    );

    // Event emitted when the rSONYA appointment cost is updated.
    event AppointmentCostRUpdated(
        uint256 newAppointmentCostR
    );

    /**
     * @notice Constructor sets the usdSONYA and rSONYA token contracts.
     * @param _usdSONYA The IERC20 token used for scheduling appointments with usdSONYA.
     * @param _rSONYA The IERC20 token used for scheduling appointments with rSONYA.
     */
    constructor(IERC20 _usdSONYA, IERC20 _rSONYA) Ownable(msg.sender) {
        require(address(_usdSONYA) != address(0), "Invalid usdSONYA address");
        require(address(_rSONYA) != address(0), "Invalid rSONYA address");
        usdSONYA = _usdSONYA;
        rSONYA = _rSONYA;
    }

    /**
     * @notice Schedule an appointment.
     *         The user must have approved this contract to spend at least 100 usdSONYA tokens.
     *         Upon calling this function, 100 usdSONYA tokens are pulled from the user's wallet and an appointment is created.
     */
    function schedule(uint32 startTimestamp) external nonReentrant {
        // Pull 100 usdSONYA tokens from the user.
        usdSONYA.safeTransferFrom(msg.sender, address(this), APPOINTMENT_COST);

        // Create an appointment struct with the provided start timestamp and a 1-hour duration.
        Appointment memory newAppointment = Appointment({
            startTimestamp: startTimestamp,
            duration: APPOINTMENT_DURATION
        });

        // Store the appointment in the mapping using the sender's address as the key.
        appointments[msg.sender] = newAppointment;

        // Emit event with the appointment details.
        emit AppointmentScheduled(newAppointment.startTimestamp, newAppointment.duration);
    }

    /**
     * @notice Schedule an appointment by paying with rSONYA tokens.
     * @param startTimestamp The desired start timestamp for the appointment.
     * @dev Requires prior approval of rSONYA tokens using the rSONYA token's approve() function
     */
    function scheduleWithRSonya(uint32 startTimestamp) external nonReentrant {
        // Validate the timestamp
        require(startTimestamp > uint32(block.timestamp), "Appointment must be in the future");
        
        // Check if user has sufficient rSONYA balance
        require(rSONYA.balanceOf(msg.sender) >= appointmentCostR, "Insufficient rSONYA balance");
        
        // Check if contract has sufficient allowance
        require(rSONYA.allowance(msg.sender, address(this)) >= appointmentCostR, "Insufficient rSONYA allowance");

        // Pull appointmentCostR rSONYA tokens from the user.
        rSONYA.safeTransferFrom(msg.sender, address(this), appointmentCostR);

        // Create an appointment struct with the provided start timestamp and a 1-hour duration.
        Appointment memory newAppointment = Appointment({
            startTimestamp: startTimestamp,
            duration: APPOINTMENT_DURATION
        });

        // Store the appointment in the mapping using the sender's address as the key.
        appointments[msg.sender] = newAppointment;

        // Emit event with the appointment details.
        emit AppointmentScheduled(newAppointment.startTimestamp, newAppointment.duration);
    }

    /**
     * @notice Set the cost for scheduling an appointment with rSONYA tokens.
     * @param newCost The new cost in rSONYA tokens.
     * @dev Only the owner can call this function.
     */
    function setAppointmentCostR(uint256 newCost) external onlyOwner {
        require(newCost > 0, "Appointment cost must be greater than zero");
        appointmentCostR = newCost;
        emit AppointmentCostRUpdated(newCost);
    }
} 