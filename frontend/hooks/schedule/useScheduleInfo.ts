import { useCallback, useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";

type AppointmentType = {
  startTimestamp: number;
  duration: number;
};

// Simple cache
let cachedAppointment: AppointmentType | null = null;
let cachedIsActive = false;

export const useScheduleInfo = () => {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const { data: scheduleContract } = useScaffoldContract({ contractName: "schedule" });

  const fetchScheduleInfo = useCallback(async () => {
    if (!address || !scheduleContract) return { appointment: null, isActive: false };

    setIsLoading(true);
    try {
      const appointmentData = (await scheduleContract.read.appointments([address])) as bigint[];
      const startTimestamp = Number(appointmentData[0]);
      const durationSeconds = Number(appointmentData[1]);

      if (startTimestamp === 0 || durationSeconds === 0) {
        cachedAppointment = null;
        cachedIsActive = false;
        console.log("📅 No appointment found for:", address);
      } else {
        cachedAppointment = { startTimestamp, duration: durationSeconds };
        const nowInSeconds = Math.floor(Date.now() / 1000);
        cachedIsActive = nowInSeconds >= startTimestamp && nowInSeconds <= startTimestamp + durationSeconds;
        console.log("📅 Appointment found:", {
          start: new Date(startTimestamp * 1000).toLocaleString(),
          duration: `${durationSeconds / 60} minutes`,
          isActive: cachedIsActive,
        });
      }

      return { appointment: cachedAppointment, isActive: cachedIsActive };
    } catch (error) {
      console.error("❌ Error fetching appointment:", error);
      return { appointment: null, isActive: false };
    } finally {
      setIsLoading(false);
    }
  }, [address, scheduleContract]);

  return {
    appointment: cachedAppointment,
    isLoading,
    hasActiveAppointment: cachedIsActive,
    appointmentStart: cachedAppointment?.startTimestamp ? new Date(cachedAppointment.startTimestamp * 1000) : null,
    appointmentEnd:
      cachedAppointment?.startTimestamp && cachedAppointment?.duration
        ? new Date((cachedAppointment.startTimestamp + cachedAppointment.duration) * 1000)
        : null,
    refetch: fetchScheduleInfo,
  };
};
