"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useAccount, useSignMessage } from "wagmi";
import { SonyaCharacter } from "~~/components/SonyaCharacter";
import { useInitializeNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import axiosInstance, { setAuthToken } from "~~/utils/axiosInstance";

const TOKEN_EXPIRY_TIME = 60 * 60 * 1000; // 60 minutes in milliseconds

const Home: NextPage = () => {
  useInitializeNativeCurrencyPrice();

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
    <main className="relative flex flex-col flex-1">
      <div className="flex flex-col items-center flex-grow pt-10">
        {address && !isAuthenticated && (
          <div className="flex flex-col items-center justify-center mt-8">
            <button
              className="px-6 py-3 text-lg font-semibold text-white bg-[#EFAF76] rounded-lg shadow hover:bg-[#D98B5F]"
              onClick={handleProveSonyaBalance}
            >
              Prove Sonya Balance
            </button>
          </div>
        )}
        {isAuthenticated && <SonyaCharacter walletAddress={address} />}
      </div>
    </main>
  );
};

export default Home;
