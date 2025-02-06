"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { StakingForm, StakingStats, WelcomeCard } from "~~/components/staking";
import deployedContracts from "~~/contracts/deployedContracts";
import { useWatchBalance } from "~~/hooks/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const sonyaTokenAddress = deployedContracts[8453].sonyaToken.address;
const rSonyaTokenAddress = deployedContracts[8453].rSonyaToken.address;

const StakingPage = () => {
  const { address } = useAccount();
  const { login, authenticated } = usePrivy();
  const [stakingAmount, setStakingAmount] = useState("");
  const [lockupPeriod, setLockupPeriod] = useState("1");
  const { data: balance } = useWatchBalance({ address, token: sonyaTokenAddress });
  const { data: rSonyaBalance } = useWatchBalance({ address, token: rSonyaTokenAddress });

  // Setup contract writes
  const { writeContractAsync: approveToken } = useScaffoldWriteContract({
    contractName: "sonyaToken",
  });

  const { writeContractAsync: stake } = useScaffoldWriteContract({
    contractName: "staking",
  });

  const handleStake = async (amount: string) => {
    if (!address || !amount) return;

    try {
      const amountInWei = parseEther(amount);

      await approveToken({
        functionName: "approve",
        args: [sonyaTokenAddress, amountInWei],
      } as never);

      await stake({
        functionName: "stake",
        args: [amountInWei],
      } as never);
    } catch (error) {
      console.error("Error staking tokens:", error);
      throw error;
    }
  };

  // Mock data
  const mockData = {
    totalStaked: "1234567",
    userStaked: rSonyaBalance?.formatted,
    veSONYA: "750",
    userBalance: balance?.formatted,
  };

  const handleStakeSubmit = async () => {
    try {
      await handleStake(stakingAmount);
      setStakingAmount("");
    } catch (error) {
      console.error("Failed to stake:", error);
    }
  };

  const setMaxAmount = () => {
    setStakingAmount(mockData.userBalance || "0");
  };

  const insufficientBalance = Number(stakingAmount) > Number(mockData.userBalance);

  return (
    <div className="h-screen bg-gradient-to-b from-base-200 to-base-300">
      <div className="container h-full max-w-5xl px-4 py-8 mx-auto overflow-y-auto">
        <div className="text-center">
          <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-center text-base-content">Stake SONYA</h1>
          <p className="mb-8 text-base text-center text-base-content/80">
            Stake your SONYA tokens to earn veSONYA and participate in governance
          </p>
        </div>

        <StakingStats
          totalStaked={mockData.totalStaked}
          userStaked={mockData.userStaked || "0"}
          veSONYA={mockData.veSONYA}
        />

        <div className="max-w-xl mx-auto">
          {!authenticated ? (
            <WelcomeCard onLogin={login} />
          ) : (
            <StakingForm
              stakingAmount={stakingAmount}
              setStakingAmount={setStakingAmount}
              lockupPeriod={lockupPeriod}
              setLockupPeriod={setLockupPeriod}
              userBalance={mockData.userBalance || "0"}
              onStakeSubmit={handleStakeSubmit}
              onSetMaxAmount={setMaxAmount}
              insufficientBalance={insufficientBalance}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StakingPage;
