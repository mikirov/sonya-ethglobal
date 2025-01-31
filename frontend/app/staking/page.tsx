"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";

const StakingPage = () => {
  const { address } = useAccount();
  const { login, authenticated } = usePrivy();
  const [stakingAmount, setStakingAmount] = useState("");
  const [lockupPeriod, setLockupPeriod] = useState("1");

  // Mock data
  const mockData = {
    totalStaked: "1234567",
    userStaked: "100000",
    veSONYA: "750",
    userBalance: "0",
  };

  const formatNumber = (value: string) => {
    // If the value ends with %, return as is
    if (value.endsWith("%")) return value;

    // Format number with commas or millions and add SONYA/veSONYA suffix
    const num = parseFloat(value);
    const suffix = value === mockData.veSONYA ? "veSONYA" : "SONYA";

    if (num >= 1000000) {
      const millions = (num / 1000000).toFixed(1);
      return `${millions}m ${suffix}`;
    }

    const formatted = new Intl.NumberFormat("en-US").format(num);
    return `${formatted} ${suffix}`;
  };

  const handleStake = async () => {
    console.log(`Staking ${stakingAmount} SONYA for ${lockupPeriod} years`);
  };

  const insufficientBalance = Number(stakingAmount) > Number(mockData.userBalance);

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300">
      <div className="container px-4 py-16 mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-center text-base-content">Stake SONYA</h1>
          <p className="mb-12 text-lg text-center text-base-content/80">
            Stake your SONYA tokens to earn veSONYA and participate in governance
          </p>
        </div>

        <div className="grid gap-8 mb-12 md:grid-cols-3">
          {[
            { title: "Total Staked", value: formatNumber(mockData.totalStaked) },
            { title: "Your Stake", value: formatNumber(mockData.userStaked) },
            { title: "Your veSONYA", value: formatNumber(mockData.veSONYA) },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex flex-col justify-end p-6 text-center transition-all rounded-2xl bg-base-100 hover:shadow-lg"
            >
              <div className="text-3xl font-bold text-center text-base-content">{stat.value}</div>
              <div className="mt-1 text-sm font-medium text-center text-base-content/60">{stat.title}</div>
            </div>
          ))}
        </div>
        <div className="max-w-2xl mx-auto">
          {!authenticated ? (
            <div className="py-20 border bg-base-200/60 rounded-[2rem] border-base-300 backdrop-blur-md shadow-xl">
              <div className="container flex flex-col items-center justify-center max-w-4xl px-6 mx-auto">
                <div className="p-10 text-center">
                  <h3 className="mb-6 text-3xl font-extrabold tracking-tight text-base-content">
                    Welcome to SONYA Staking
                  </h3>
                  <p className="mb-8 text-sm leading-relaxed text-base-content/70">
                    To start staking your SONYA tokens and unlock exclusive benefits, you&apos;ll need to connect your
                    wallet first. By staking, you&apos;ll earn veSONYA tokens which give you governance rights, revenue
                    sharing, and special access to Sonya&apos;s services.
                  </p>
                  <div className="mb-10 text-left">
                    <div className="flex items-center gap-4 text-base-content/70">
                      <div className="w-3 h-3 rounded-full bg-primary/90"></div>
                      <p className="text-lg font-medium">Earn a share of platform revenue</p>
                    </div>
                    <div className="flex items-center gap-4 text-base-content/70">
                      <div className="w-3 h-3 rounded-full bg-primary/90"></div>
                      <p className="text-lg font-medium">Get exclusive access to free sessions with Sonya</p>
                    </div>
                    <div className="flex items-center gap-4 text-base-content/70">
                      <div className="w-3 h-3 rounded-full bg-primary/90"></div>
                      <p className="text-lg font-medium">Participate in platform governance decisions</p>
                    </div>
                  </div>
                  <button onClick={login} className="btn btn-primary">
                    Connect Wallet
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 transition-all rounded-3xl bg-base-100 hover:shadow-xl">
              <div className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="text-base font-medium label-text">Amount to Stake</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="0.0"
                      className="w-full pr-20 input input-bordered focus:input-primary"
                      value={stakingAmount}
                      onChange={e => setStakingAmount(e.target.value)}
                    />
                    <span className="absolute text-sm font-medium transform -translate-y-1/2 right-4 top-1/2 text-base-content/60">
                      SONYA
                    </span>
                  </div>
                  <label className="label">
                    <span className="label-text-alt">Balance: {mockData.userBalance} SONYA</span>
                  </label>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="text-base font-medium label-text">Lock Period</span>
                  </label>
                  <select
                    className="w-full select select-bordered focus:select-primary"
                    value={lockupPeriod}
                    onChange={e => setLockupPeriod(e.target.value)}
                  >
                    {[1, 2, 3, 4].map(year => (
                      <option key={year} value={year}>
                        {year} {year === 1 ? "Year" : "Years"}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleStake}
                  disabled={insufficientBalance}
                  className="w-full transition-all btn btn-primary btn-lg hover:brightness-105"
                >
                  {insufficientBalance ? "Insufficient Balance" : "Stake SONYA"}
                </button>

                <div className="space-y-2">
                  <p className="text-sm text-center text-base-content/60">
                    Make sure you have enough SONYA tokens in your wallet before staking
                  </p>
                  {insufficientBalance && (
                    <a
                      href="https://app.virtuals.io/prototypes/0x7Bcbc36f7c4D5175B13Dfb789A3C360381D2F14D"
                      className="inline-block text-sm text-primary hover:underline"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Get more SONYA tokens →
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StakingPage;
