"use client";

import Link from "next/link";
import { useScheduleInfo } from "~~/hooks/schedule/useScheduleInfo";

export default function Home() {
  const { hasActiveAppointment } = useScheduleInfo();

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
            {hasActiveAppointment ? (
              <Link href="/chat" className="px-8 py-3 text-base font-medium rounded-xl btn btn-primary animate-pulse">
                Join Your Active Session
              </Link>
            ) : (
              <Link href="/schedule" className="px-8 py-3 text-base font-medium rounded-xl btn btn-primary">
                Schedule a Session
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
