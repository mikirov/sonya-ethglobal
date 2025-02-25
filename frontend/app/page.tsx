"use client";

import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { SonyaCharacter } from "~~/components/SonyaCharacter";
import { useScheduleInfo } from "~~/hooks/schedule/useScheduleInfo";

export default function Home() {
  const { authenticated } = usePrivy();
  const { hasActiveAppointment } = useScheduleInfo();

  if (authenticated) {
    return (
      <main className="relative flex flex-col flex-1 h-full overflow-hidden">
        <SonyaCharacter />
        {!hasActiveAppointment && (
          <div className="absolute top-0 left-0 right-0 p-2 text-center bg-warning/20">
            <Link href="/schedule" className="hover:underline">
              Schedule a session to unlock unlimited chat
            </Link>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center flex-1">
      <div className="container px-6 py-32 space-y-8 text-center max-w-7xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-base-content sm:text-5xl md:text-6xl">
          Welcome to Sonya AI
        </h1>
        <div className="max-w-xl mx-auto">
          <p className="mb-8 text-xl text-base-content/80">
            Schedule a consultation with Sonya AI and get personalized assistance.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/schedule" className="px-8 py-3 text-base font-medium rounded-xl btn btn-primary">
              Schedule a Session
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
