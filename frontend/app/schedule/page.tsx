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
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300">
      <div className="container px-4 py-16 mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-center text-base-content">
            Schedule with Sonya AI
          </h1>
          <p className="mb-12 text-lg text-center text-base-content/80">Book your next session with Sonya AI</p>
        </div>

        <div className="max-w-2xl mx-auto">
          {!authenticated ? (
            <div className="py-20 border bg-base-200/60 rounded-[2rem] border-base-300 backdrop-blur-md shadow-xl">
              <div className="container flex flex-col items-center justify-center max-w-4xl px-6 mx-auto">
                <div className="p-10 text-center">
                  <h3 className="mb-6 text-3xl font-extrabold tracking-tight text-base-content">
                    Welcome to Sonya AI Scheduling
                  </h3>
                  <p className="mb-8 text-sm leading-relaxed text-base-content/70">
                    To start scheduling sessions with Sonya AI, you&apos;ll need to connect your wallet first. Get
                    personalized AI consultations and strategy sessions to help grow your business.
                  </p>
                  <div className="mb-10 text-left">
                    <div className="flex items-center gap-4 text-base-content/70">
                      <div className="w-3 h-3 rounded-full bg-primary/90"></div>
                      <p className="text-lg font-medium">1-on-1 AI Strategy Sessions</p>
                    </div>
                    <div className="flex items-center gap-4 text-base-content/70">
                      <div className="w-3 h-3 rounded-full bg-primary/90"></div>
                      <p className="text-lg font-medium">Flexible Scheduling Options</p>
                    </div>
                    <div className="flex items-center gap-4 text-base-content/70">
                      <div className="w-3 h-3 rounded-full bg-primary/90"></div>
                      <p className="text-lg font-medium">Personalized AI Consultations</p>
                    </div>
                  </div>
                  <button onClick={login} className="text-white btn btn-primary">
                    Connect to Sonya AI
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 transition-all rounded-3xl bg-base-100 hover:shadow-xl">
              <form onSubmit={handleScheduleEvent} className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="text-base font-medium label-text">Event Title</span>
                  </label>
                  <input
                    type="text"
                    value={eventTitle}
                    onChange={e => setEventTitle(e.target.value)}
                    className="w-full input input-bordered focus:input-primary"
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="text-base font-medium label-text">Date</span>
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    className="w-full input input-bordered focus:input-primary"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="text-base font-medium label-text">Time</span>
                  </label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={e => setSelectedTime(e.target.value)}
                    className="w-full input input-bordered focus:input-primary"
                    required
                  />
                </div>

                <button type="submit" className="w-full transition-all btn btn-primary btn-lg hover:brightness-105">
                  Schedule Event
                </button>
              </form>

              <div className="mt-8">
                <h2 className="mb-4 text-xl font-semibold">Upcoming Events</h2>
                <div className="space-y-2">
                  <div className="p-4 rounded-lg bg-base-300">
                    <h3 className="font-medium">Mock Meeting with Sonya AI</h3>
                    <p className="text-sm">Tomorrow at 2:00 PM</p>
                  </div>
                  <div className="p-4 rounded-lg bg-base-300">
                    <h3 className="font-medium">AI Strategy Session</h3>
                    <p className="text-sm">Friday at 11:00 AM</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
