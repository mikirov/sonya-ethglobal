"use client";

import { usePrivy } from "@privy-io/react-auth";
import type { NextPage } from "next";
import { SonyaCharacter } from "~~/components/SonyaCharacter";
import WelcomeBanner from "~~/components/WelcomeBanner";
import { useInitializeNativeCurrencyPrice } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  useInitializeNativeCurrencyPrice();
  const { authenticated } = usePrivy();

  return (
    <main className="relative flex flex-col flex-1 h-full overflow-hidden">
      {!authenticated ? <WelcomeBanner /> : <SonyaCharacter />}
    </main>
  );
};

export default Home;
