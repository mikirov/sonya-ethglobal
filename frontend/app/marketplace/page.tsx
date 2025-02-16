"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import Marketplace from "~~/components/scheduler/Marketplace";

const MarketplacePage = () => {
  const { authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (!authenticated) {
      router.push("/");
    }
  }, [authenticated, router]);

  return (
    <main className="relative flex flex-col flex-1 h-full">
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-center text-base-content">
            Sonya AI Marketplace
          </h1>
          <p className="mb-6 text-base text-center text-base-content/80">Browse and purchase Sonya AI services</p>
        </div>
        <Marketplace />
      </div>
    </main>
  );
};

export default MarketplacePage;
