import React, { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { useAccount } from "wagmi";
import externalContracts from "~~/contracts/externalContracts";
import { useScaffoldContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

type ScheduleFormProps = {
  onScheduled?: () => void;
};

const ScheduleForm: React.FC<ScheduleFormProps> = ({ onScheduled }) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isScheduling, setIsScheduling] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [hasAllowance, setHasAllowance] = useState(false);

  // Calculate min and max dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 7);

  // Format dates for input min/max attributes
  const minDateStr = today.toISOString().split("T")[0];
  const maxDateStr = maxDate.toISOString().split("T")[0];

  // Get current hour for time input validation
  const currentHour = new Date().getHours();
  const minTimeForToday = `${currentHour + 1}:00`; // Next available hour

  const validateDateTime = (date: string, time: string): boolean => {
    const selectedDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    const weekFromNow = new Date(now);
    weekFromNow.setDate(now.getDate() + 7);

    return selectedDateTime > now && selectedDateTime <= weekFromNow;
  };

  const { data: scheduleContract } = useScaffoldContract({ contractName: "schedule" });
  const { data: rSonyaContract } = useScaffoldContract({ contractName: "rSonyaToken" });
  const { writeContractAsync: schedule } = useScaffoldWriteContract({ contractName: "schedule" });
  const { writeContractAsync: approve } = useScaffoldWriteContract({ contractName: "rSonyaToken" });
  const { address } = useAccount();
  const checkAllowance = async () => {
    if (!scheduleContract || !rSonyaContract) return;

    try {
      const cost = (await scheduleContract.read.appointmentCostR()) as bigint;
      console.log("🏷️ Appointment cost:", cost.toString());

      const allowance = (await rSonyaContract.read.allowance([address, scheduleContract.address])) as bigint;
      console.log("💰 Current allowance:", allowance.toString());

      setHasAllowance(allowance >= cost);
    } catch (error) {
      console.error("❌ Error checking allowance:", error);
    }
  };

  const approveTokens = async () => {
    if (!scheduleContract || !rSonyaContract) return;

    try {
      setIsApproving(true);
      const maxUint256 = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");

      await approve({
        functionName: "approve",
        args: [scheduleContract.address, maxUint256],
      } as never);

      console.log("✅ Max approval successful");
      await checkAllowance();
    } catch (error) {
      console.error("❌ Error approving tokens:", error);
    } finally {
      setIsApproving(false);
    }
  };

  const handleScheduleEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;

    // Validate selected date and time
    if (!validateDateTime(selectedDate, selectedTime)) {
      alert("Please select a time between now and one week from now");
      return;
    }

    try {
      if (!hasAllowance) {
        await approveTokens();
      }

      setIsScheduling(true);
      console.log("🗓️ Scheduling appointment:", { date: selectedDate, time: selectedTime });

      // Create a Date object in local timezone
      const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
      // Convert to UTC timestamp in seconds
      const timestamp = Math.floor(selectedDateTime.getTime() / 1000);

      console.log("⏰ Selected DateTime:", selectedDateTime.toISOString());
      console.log("⏰ Timestamp (seconds):", timestamp);

      await schedule({
        functionName: "scheduleWithRSonya",
        args: [BigInt(timestamp)],
      } as never);

      console.log("✅ Scheduling successful");
      setSelectedDate("");
      setSelectedTime("");

      // Add small delay to allow transaction to be mined
      setTimeout(() => {
        onScheduled?.();
      }, 1000);
    } catch (error) {
      console.error("❌ Error scheduling appointment:", error);
    } finally {
      setIsScheduling(false);
    }
  };

  useEffect(() => {
    checkAllowance();
  }, [scheduleContract, rSonyaContract]);

  return (
    <form onSubmit={handleScheduleEvent} className="space-y-4">
      <div className="form-control">
        <label className="py-1 label">
          <span className="text-sm font-medium label-text">Date</span>
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          min={minDateStr}
          max={maxDateStr}
          className="w-full h-10 input input-bordered focus:input-primary"
          required
        />
      </div>

      <div className="form-control">
        <label className="py-1 label">
          <span className="text-sm font-medium label-text">Time</span>
        </label>
        <input
          type="time"
          value={selectedTime}
          onChange={e => setSelectedTime(e.target.value)}
          min={selectedDate === minDateStr ? minTimeForToday : "00:00"}
          max="23:00"
          step={3600} // 1 hour intervals
          className="w-full h-10 input input-bordered focus:input-primary"
          required
        />
        <span className="mt-1 text-xs text-base-content/60">Available in 1-hour intervals</span>
      </div>

      <button
        type="submit"
        className="w-full h-10 transition-all btn btn-primary hover:brightness-105"
        disabled={isScheduling || !validateDateTime(selectedDate, selectedTime)}
      >
        {isScheduling ? "Scheduling..." : "Schedule Event"}
      </button>
    </form>
  );
};

export default ScheduleForm;
