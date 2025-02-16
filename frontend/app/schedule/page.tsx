"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import LoginSchedule from "~~/components/scheduler/LoginSchedule";
import ScheduleForm from "~~/components/scheduler/ScheduleForm";
import UpcomingEvents from "~~/components/scheduler/UpcomingEvents";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";

const SchedulePage = () => {
  const { authenticated } = usePrivy();
  const router = useRouter();
  const { address } = useAccount();
  const { data: scheduleContract } = useScaffoldContract({ contractName: "schedule" });

  const [hasCheckedBalance, setHasCheckedBalance] = useState(false);
  const [appointment, setAppointment] = useState<{ time: string } | undefined>(undefined);
  const [hasFetchedInitial, setHasFetchedInitial] = useState(false);

  // Check authentication and stake
  useEffect(() => {
    console.log("🔍 Checking authentication and stake:", {
      authenticated,
      address,
      hasContract: !!scheduleContract,
      hasCheckedBalance,
    });

    if (!authenticated) {
      console.log("🚫 Not authenticated, redirecting to home");
      router.push("/");
      return;
    }

    setHasCheckedBalance(true);
  }, [authenticated, address, hasCheckedBalance, router, scheduleContract]);

  // Move fetchAppointment into useCallback to prevent recreation
  const fetchAppointment = useCallback(async () => {
    if (!scheduleContract || !address) return;

    try {
      const appointmentData = (await scheduleContract.read.appointments([address])) as bigint[];

      if (appointmentData[0] !== 0n && appointmentData[1] !== 0n) {
        // Convert timestamp from seconds to milliseconds for Date constructor
        const timestampMs = Number(appointmentData[0]) * 1000;
        console.log("🔍 Appointment timestamp (ms):", timestampMs);

        const date = new Date(timestampMs);
        console.log("🔍 Appointment date:", date.toISOString());

        const appointment = {
          time: date.toLocaleString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          }),
        };
        console.log("✅ Formatted appointment:", appointment);

        setAppointment(appointment);
      }
    } catch (error) {
      console.error("❌ Error fetching appointment:", error);
    }
  }, [scheduleContract, address]);

  // Initial fetch on mount only
  useEffect(() => {
    if (!hasFetchedInitial && authenticated && scheduleContract && address) {
      fetchAppointment();
      setHasFetchedInitial(true);
    }
  }, [authenticated, scheduleContract, address, hasFetchedInitial, fetchAppointment]);

  // Show loading state while checking balance
  if (!authenticated || !hasCheckedBalance) {
    return <div>Loading...</div>;
  }

  return (
    <main className="relative flex flex-col flex-1 h-full">
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-center text-base-content">
            Schedule with Sonya AI
          </h1>
          <p className="mb-6 text-base text-center text-base-content/80">Book your next session with Sonya AI</p>
        </div>

        <div className="max-w-2xl mx-auto">
          {!authenticated ? (
            <LoginSchedule />
          ) : (
            <div className="p-6 transition-all rounded-2xl bg-base-100 hover:shadow-xl">
              <ScheduleForm onScheduled={fetchAppointment} />
              <UpcomingEvents appointment={appointment} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default SchedulePage;
