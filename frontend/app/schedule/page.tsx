"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";

const SchedulePage = () => {
  const { login, authenticated } = usePrivy();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [eventTitle, setEventTitle] = useState<string>("");

  const handleScheduleEvent = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to schedule the event
    console.log("Scheduling event:", {
      date: selectedDate,
      time: selectedTime,
      title: eventTitle,
    });
  };

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
            <div className="relative py-12 border bg-base-300/50 rounded-[2rem] border-base-300/50 backdrop-blur-xl">
              <div className="container flex flex-col items-center justify-center max-w-4xl px-4 mx-auto">
                <div className="p-6 text-center">
                  <h3 className="mb-4 text-2xl font-extrabold tracking-tight text-base-content">
                    Welcome to Sonya AI Scheduling
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-base-content/70">
                    To start scheduling sessions with Sonya AI, you&apos;ll need to connect your wallet first. Get
                    personalized AI consultations and strategy sessions to help grow your business.
                  </p>
                  <div className="mb-6 text-left">
                    <div className="flex items-center gap-3 text-base-content/70">
                      <div className="w-2 h-2 rounded-full bg-primary/90"></div>
                      <p className="text-base font-medium">1-on-1 AI Strategy Sessions</p>
                    </div>
                    <div className="flex items-center gap-3 text-base-content/70">
                      <div className="w-2 h-2 rounded-full bg-primary/90"></div>
                      <p className="text-base font-medium">Flexible Scheduling Options</p>
                    </div>
                    <div className="flex items-center gap-3 text-base-content/70">
                      <div className="w-2 h-2 rounded-full bg-primary/90"></div>
                      <p className="text-base font-medium">Personalized AI Consultations</p>
                    </div>
                  </div>
                  <button onClick={login} className="text-white btn btn-primary">
                    Connect to Sonya AI
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 transition-all rounded-2xl bg-base-100 hover:shadow-xl">
              <form onSubmit={handleScheduleEvent} className="space-y-4">
                <div className="form-control">
                  <label className="py-1 label">
                    <span className="text-sm font-medium label-text">Event Title</span>
                  </label>
                  <input
                    type="text"
                    value={eventTitle}
                    onChange={e => setEventTitle(e.target.value)}
                    className="w-full h-10 input input-bordered focus:input-primary"
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="py-1 label">
                    <span className="text-sm font-medium label-text">Date</span>
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
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
                    className="w-full h-10 input input-bordered focus:input-primary"
                    required
                  />
                </div>

                <button type="submit" className="w-full h-10 transition-all btn btn-primary hover:brightness-105">
                  Schedule Event
                </button>
              </form>

              <div className="mt-6">
                <h2 className="mb-3 text-lg font-semibold">Upcoming Events</h2>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-base-300">
                    <h3 className="text-sm font-medium">Mock Meeting with Sonya AI</h3>
                    <p className="text-xs">Tomorrow at 2:00 PM</p>
                  </div>
                  <div className="p-3 rounded-lg bg-base-300">
                    <h3 className="text-sm font-medium">AI Strategy Session</h3>
                    <p className="text-xs">Friday at 11:00 AM</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default SchedulePage;
