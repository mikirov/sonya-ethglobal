import React, { useState } from "react";

const ScheduleForm = () => {
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
  );
};

export default ScheduleForm;
