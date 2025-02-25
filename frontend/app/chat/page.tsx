"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import { SonyaCharacter } from "~~/components/SonyaCharacter";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";

const FREE_MESSAGE_LIMIT = 5;

const ChatPage = () => {
  const { authenticated } = usePrivy();
  const router = useRouter();
  const { address } = useAccount();
  const { data: scheduleContract } = useScaffoldContract({ contractName: "schedule" });
  const [hasValidAppointment, setHasValidAppointment] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [showLimitMessage, setShowLimitMessage] = useState(false);

  useEffect(() => {
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
          const appointmentTime = Number(appointment[0]) * 1000;
          const duration = Number(appointment[1]) * 1000;
          const now = Date.now();
          const isWithinAppointment = now >= appointmentTime && now <= appointmentTime + duration;
          setHasValidAppointment(isWithinAppointment);
        }
      } catch (error) {
        console.error("❌ Error checking appointment:", error);
      }
    };

    checkAppointment();
  }, [authenticated, address, router, scheduleContract]);

  const handleNewMessage = () => {
    if (!hasValidAppointment) {
      const newCount = messageCount + 1;
      setMessageCount(newCount);
      if (newCount >= FREE_MESSAGE_LIMIT) {
        setShowLimitMessage(true);
      }
    }
  };

  if (showLimitMessage) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold">You&apos;ve reached your free message limit</h2>
        <p className="mb-8 text-lg">To continue chatting with Sonya, you can:</p>
        <div className="flex gap-4">
          <Link href="/stake" className="btn btn-primary">
            Stake Tokens
          </Link>
          <Link href="/schedule" className="btn btn-secondary">
            Schedule a Session
          </Link>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <div>Please connect your wallet to continue...</div>;
  }

  return (
    <main className="relative flex flex-col flex-1 h-full overflow-hidden">
      <SonyaCharacter onNewMessage={handleNewMessage} />
      {!hasValidAppointment && (
        <div className="absolute top-0 left-0 right-0 p-2 text-center bg-warning/20">
          Free trial: {messageCount}/{FREE_MESSAGE_LIMIT} messages used
        </div>
      )}
    </main>
  );
};

export default ChatPage;
