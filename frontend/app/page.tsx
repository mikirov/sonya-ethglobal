"use client";

import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import type { NextPage } from "next";
import { useAccount, useSignMessage } from "wagmi";
import { SonyaCharacter } from "~~/components/SonyaCharacter";
import { useInitializeNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import axiosInstance, { setAuthToken } from "~~/utils/axiosInstance";

const TOKEN_EXPIRY_TIME = 60 * 60 * 1000; // 60 minutes in milliseconds

const Home: NextPage = () => {
  useInitializeNativeCurrencyPrice();
  const { login, authenticated } = usePrivy();
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Clear JWT from local storage
  const clearJWT = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("jwtExpiry");
    setAuthToken(null);
    setIsAuthenticated(false);
  };

  // Initialize authentication state from local storage
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    const jwtExpiry = localStorage.getItem("jwtExpiry");

    if (jwt && jwtExpiry) {
      const now = Date.now();
      if (parseInt(jwtExpiry) > now) {
        setAuthToken(jwt);
        setIsAuthenticated(true);

        // Schedule JWT clearing after expiry
        const timeLeft = parseInt(jwtExpiry) - now;
        setTimeout(clearJWT, timeLeft);
      } else {
        // Clear expired JWT
        clearJWT();
      }
    }
  }, []);

  const handleProveSonyaBalance = async () => {
    if (!address) {
      console.error("Wallet not connected");
      return;
    }

    try {
      const message = "Hello Sonya";
      const signature = await signMessageAsync({ message });

      const response = await axiosInstance.post("/verify", {
        walletAddress: address,
        signature,
      });

      if (response.data.success) {
        console.log("Authentication successful!");
        setIsAuthenticated(true);

        if (response.data.jwt) {
          setAuthToken(response.data.jwt);
          localStorage.setItem("jwt", response.data.jwt);
          localStorage.setItem("jwtExpiry", (Date.now() + TOKEN_EXPIRY_TIME).toString());
          setTimeout(clearJWT, TOKEN_EXPIRY_TIME);
        }
      } else {
        console.error("Authentication failed");
      }
    } catch (error) {
      console.error("Error signing message or sending request:", error);
    }
  };

  return (
    <main className="relative flex flex-col flex-1 h-full overflow-hidden">
      {!authenticated ? (
        <div className="relative py-24 border bg-gradient-to-br from-base-200/95 via-base-200/90 to-base-200/80 rounded-[2.5rem] border-base-300/50 backdrop-blur-xl overflow-y-auto">
          <div className="relative flex flex-col items-center justify-center max-w-4xl px-8 mx-auto ">
            <div className="p-10 text-center">
              <h3 className="mb-6 text-5xl font-black tracking-tight text-transparent bg-gradient-to-br from-base-content to-base-content/70 bg-clip-text">
                Welcome to Sonya AI Chat
              </h3>

              <p className="max-w-2xl mx-auto mb-12 text-lg leading-relaxed text-base-content/70">
                Experience the next generation of AI assistance. Connect your wallet to begin your journey with Sonya AI
                and unlock personalized insights to transform your business.
              </p>

              <button
                onClick={login}
                className="px-8 mb-12 text-lg font-bold text-center text-white transition-all btn btn-accent hover:scale-105"
              >
                Connect to Sonya AI
              </button>

              <div className="grid gap-4 mx-auto mb-12 md:grid-cols-3">
                <div className="relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-base-100/40 to-base-100/80 backdrop-blur-xl rounded-3xl" />
                  <div className="relative p-8 transition-all duration-500 hover:transform hover:scale-[1.02]">
                    <div className="inline-flex items-center justify-center w-12 h-12 mb-6 transition-all duration-300 rounded-2xl bg-primary/20 text-primary group-hover:scale-110 group-hover:bg-primary/30">
                      <div className="text-2xl">🤖</div>
                    </div>
                    <h4 className="mb-3 text-xl font-medium text-base-content">AI Assistance</h4>
                    <p className="text-base leading-relaxed text-base-content/70">
                      Personalized support tailored to your needs
                    </p>
                    <div className="absolute bottom-0 left-0 right-0 h-1 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 group-hover:opacity-100" />
                  </div>
                </div>

                <div className="relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-base-100/40 to-base-100/80 backdrop-blur-xl rounded-3xl" />
                  <div className="relative p-8 transition-all duration-500 hover:transform hover:scale-[1.02]">
                    <div className="inline-flex items-center justify-center w-12 h-12 mb-6 transition-all duration-300 rounded-2xl bg-primary/20 text-primary group-hover:scale-110 group-hover:bg-primary/30">
                      <div className="text-2xl">📈</div>
                    </div>
                    <h4 className="mb-3 text-xl font-medium text-base-content">Growth Insights</h4>
                    <p className="text-base leading-relaxed text-base-content/70">Data-driven strategies for success</p>
                    <div className="absolute bottom-0 left-0 right-0 h-1 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 group-hover:opacity-100" />
                  </div>
                </div>

                <div className="relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-base-100/40 to-base-100/80 backdrop-blur-xl rounded-3xl" />
                  <div className="relative p-8 transition-all duration-500 hover:transform hover:scale-[1.02]">
                    <div className="inline-flex items-center justify-center w-12 h-12 mb-6 transition-all duration-300 rounded-2xl bg-primary/20 text-primary group-hover:scale-110 group-hover:bg-primary/30">
                      <div className="text-2xl">⚡</div>
                    </div>
                    <h4 className="mb-3 text-xl font-medium text-base-content">24/7 Support</h4>
                    <p className="text-base leading-relaxed text-base-content/70">
                      Always available when you need help
                    </p>
                    <div className="absolute bottom-0 left-0 right-0 h-1 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 group-hover:opacity-100" />
                  </div>
                </div>
              </div>

              <button
                onClick={login}
                className="px-8 text-lg font-bold text-center text-white transition-all btn btn-accent hover:scale-105"
              >
                Connect to Sonya AI
              </button>
            </div>
          </div>
        </div>
      ) : (
        <SonyaCharacter walletAddress={address} />
      )}
    </main>
  );
};

export default Home;
