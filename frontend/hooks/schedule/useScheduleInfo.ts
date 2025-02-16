import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";

type AppointmentType = {
  startTimestamp: number;
  duration: number;
};

export const useScheduleInfo = () => {
  const { address } = useAccount();
  const [appointment, setAppointment] = useState<AppointmentType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasActiveAppointment, setHasActiveAppointment] = useState(false);

  const { data: scheduleContract } = useScaffoldContract({
    contractName: "schedule",
  });

  const fetchScheduleInfo = async () => {
    if (!address || !scheduleContract) {
      setIsLoading(false);
      return;
    }

    try {
      const appointmentData = (await scheduleContract.read.appointments([address])) as bigint[];

      // Check if the appointment data is valid (non-zero values)
      if (appointmentData[0] === 0n || appointmentData[1] === 0n) {
        setAppointment(null);
        setHasActiveAppointment(false);
        return;
      }

      const appointmentInfo = {
        startTimestamp: Number(appointmentData[0]),
        duration: Number(appointmentData[1]),
      };

      setAppointment(appointmentInfo);

      // Check if appointment is active (current time is within appointment window)
      const now = Math.floor(Date.now() / 1000);
      const endTimestamp = appointmentInfo.startTimestamp + appointmentInfo.duration;
      const isActive = now >= appointmentInfo.startTimestamp && now <= endTimestamp;

      setHasActiveAppointment(isActive);
    } catch (error) {
      console.error("❌ Error fetching appointment:", error);
      setAppointment(null);
      setHasActiveAppointment(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduleInfo();
    const intervalId = setInterval(fetchScheduleInfo, 60000);
    return () => clearInterval(intervalId);
  }, [address, scheduleContract]);

  return {
    appointment,
    isLoading,
    hasActiveAppointment,
    appointmentStart: appointment?.startTimestamp ? new Date(appointment.startTimestamp * 1000) : null,
    appointmentEnd:
      appointment?.startTimestamp && appointment?.duration
        ? new Date((appointment.startTimestamp + appointment.duration) * 1000)
        : null,
    refetch: fetchScheduleInfo,
  };
};
