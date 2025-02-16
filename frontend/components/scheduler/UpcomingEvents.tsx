import React from "react";

type UpcomingEventsProps = {
  appointment?: {
    time: string;
  };
};

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ appointment }) => {
  return (
    <div className="mt-6">
      <h2 className="mb-3 text-lg font-semibold">Upcoming Events</h2>
      <div>
        {appointment ? (
          <div className="p-3 rounded-lg bg-base-300">
            <h3 className="text-sm font-medium">Meeting with Sonya</h3>
            <p className="text-xs">{appointment.time}</p>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-base-300">
            <h3 className="text-sm font-medium">Mock Meeting with Sonya AI</h3>
            <p className="text-xs">Tomorrow at 2:00 PM</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingEvents;
