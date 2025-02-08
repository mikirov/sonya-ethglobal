import React from "react";
import { usePrivy } from "@privy-io/react-auth";

const LoginSchedule = () => {
  const { login } = usePrivy();
  return (
    <div className="relative py-12 border bg-base-300/50 rounded-[2rem] border-base-300/50 backdrop-blur-xl">
      <div className="container flex flex-col items-center justify-center max-w-4xl px-4 mx-auto">
        <div className="p-6 text-center">
          <h3 className="mb-4 text-2xl font-extrabold tracking-tight text-base-content">
            Welcome to Sonya AI Scheduling
          </h3>
          <p className="mb-4 text-sm leading-relaxed text-base-content/70">
            To start scheduling sessions with Sonya AI, you&apos;ll need to connect your wallet first. Get personalized
            AI consultations and strategy sessions to help grow your business.
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
  );
};

export default LoginSchedule;
