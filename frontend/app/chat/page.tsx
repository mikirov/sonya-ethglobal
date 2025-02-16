"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import { SonyaCharacter } from "~~/components/SonyaCharacter";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";

const ChatPage = () => {
  const { authenticated } = usePrivy();
  const router = useRouter();
  const { address } = useAccount();
  const { data: scheduleContract } = useScaffoldContract({ contractName: "schedule" });
  const [hasValidAppointment, setHasValidAppointment] = useState(false);

  useEffect(() => {
    console.log("🔍 Checking schedule appointment status");
    if (!authenticated) {
      console.log("🚫 Not authenticated, redirecting to home");
      router.push("/");
      return;
    }

    const checkAppointment = async () => {
      if (!address || !scheduleContract) {
        console.log("⚠️ Missing address or schedule contract; skipping appointment check");
        return;
      }

      try {
        const appointment = (await scheduleContract.read.appointments([address])) as bigint[];
        if (appointment[0] !== 0n && appointment[1] !== 0n) {
          // Convert timestamp from seconds to milliseconds
          const appointmentTime = Number(appointment[0]) * 1000;
          const duration = Number(appointment[1]) * 1000; // duration in milliseconds
          const now = Date.now();

          // Check if current time is within appointment window
          const isWithinAppointment = now >= appointmentTime && now <= appointmentTime + duration;

          console.log("✅ Appointment found:", {
            appointmentTime: new Date(appointmentTime).toISOString(),
            duration: `${duration / 1000 / 60} minutes`,
            isWithinAppointment,
          });

          setHasValidAppointment(isWithinAppointment);

          if (!isWithinAppointment) {
            console.log("⏰ Not within appointment window, redirecting to schedule");
            router.push("/schedule");
          }
        } else {
          console.log("ℹ️ No appointment found, redirecting to schedule");
          router.push("/schedule");
        }
      } catch (error) {
        console.error("❌ Error checking appointment:", error);
        router.push("/schedule");
      }
    };

    checkAppointment();
  }, [authenticated, address, router, scheduleContract]);

  if (!hasValidAppointment) {
    return <div>Checking appointment...</div>;
  }

  return (
    <main className="relative flex flex-col flex-1 h-full overflow-hidden">
      <SonyaCharacter />
    </main>
  );
};

export default ChatPage;
