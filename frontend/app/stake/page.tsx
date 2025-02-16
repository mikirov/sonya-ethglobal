"use client";

import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import { useBalance } from "wagmi";
import { StakingForm, StakingStats, WelcomeCard } from "~~/components/staking";
import externalContracts from "~~/contracts/externalContracts";
import { useScaffoldContract, useWatchBalance } from "~~/hooks/scaffold-eth";

const rSonyaTokenAddress = externalContracts[8453].rSonyaToken.address;
const usdSonyaTokenAddress = externalContracts[8453].usdSonyaToken.address;

const StakingPage = () => {
  const { address } = useAccount();
  const { authenticated } = usePrivy();
  const [totalStaked, setTotalStaked] = useState<string>("0");

  // Add loading states
  const [isLoading, setIsLoading] = useState(true);

  // Use regular balance queries instead of watch for better performance
  const { data: rSonyaBalance, isError: rSonyaError } = useBalance({
    address,
    token: rSonyaTokenAddress,
  });

  const { data: usdSonyaBalance, isError: usdSonyaError } = useBalance({
    address,
    token: usdSonyaTokenAddress,
  });

  const { data: stakingContract } = useScaffoldContract({
    contractName: "staking",
  });

  useEffect(() => {
    const fetchTotalStaked = async () => {
      try {
        setIsLoading(true);
        if (!stakingContract) return;

        const totalStaked = await stakingContract.read.totalStaked();
        const formattedTotal = totalStaked ? (BigInt(totalStaked.toString()) / 10n ** 18n).toString() : "0";
        setTotalStaked(formattedTotal);
      } catch (error) {
        console.error("Error fetching total staked:", error);
        setTotalStaked("0");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTotalStaked();
  }, [stakingContract]);

  return (
    <div className="h-screen bg-gradient-to-b from-base-200 to-base-300">
      <div className="container h-full max-w-5xl px-4 py-8 mx-auto overflow-y-auto">
        <div className="text-center">
          <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-center text-base-content">Stake SONYA</h1>
          <p className="mb-8 text-base text-center text-base-content/80">
            Stake your SONYA tokens to earn rSONYA and participate in governance
          </p>
        </div>

        <StakingStats totalStaked={totalStaked || "0"} userStaked={rSonyaBalance?.formatted || "0"} />

        <div className="max-w-xl mx-auto">{!authenticated ? <WelcomeCard /> : <StakingForm />}</div>
      </div>
    </div>
  );
};

export default StakingPage;
