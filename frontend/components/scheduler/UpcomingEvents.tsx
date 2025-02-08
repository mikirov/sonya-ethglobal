import React from "react";

const UpcomingEvents = () => {
  return (
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
  );
};

export default UpcomingEvents;
