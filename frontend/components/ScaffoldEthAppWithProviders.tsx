"use client";

import { useEffect, useState } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
        config={{
          loginMethods: ["wallet", "email", "sms"],
          appearance: {
            theme: mounted ? (isDarkMode ? "dark" : "light") : "light",
            accentColor: "#2299dd",
            logo: "/logo.svg",
            showWalletLoginFirst: true,
          },
          embeddedWallets: {
            createOnLogin: "users-without-wallets",
            requireUserPasswordOnCreate: true,
            showWalletUIs: true,
          },
        }}
      >
        <WagmiProvider config={wagmiConfig}>
          <ProgressBar height="3px" color="#2299dd" />
          {children}
          <Toaster />
        </WagmiProvider>
      </PrivyProvider>
    </QueryClientProvider>
  );
};
