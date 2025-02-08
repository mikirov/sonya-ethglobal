"use client";

import { usePrivy } from "@privy-io/react-auth";
import LoginSchedule from "~~/components/scheduler/LoginSchedule";
import Marketplace from "~~/components/scheduler/Marketplace";
import ScheduleForm from "~~/components/scheduler/ScheduleForm";
import UpcomingEvents from "~~/components/scheduler/UpcomingEvents";

const SchedulePage = () => {
  const { authenticated } = usePrivy();

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
              <ScheduleForm />
              <UpcomingEvents />
            </div>
          )}
        </div>
      </div>
      <Marketplace />
    </main>
  );
};

export default SchedulePage;
