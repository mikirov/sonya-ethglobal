"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import { StakingForm, StakingStats, WelcomeCard } from "~~/components/staking";
import externalContracts from "~~/contracts/externalContracts";
import { useWatchBalance } from "~~/hooks/scaffold-eth";
import { useStake } from "~~/hooks/staking/useStake";

const sonyaTokenAddress = externalContracts[8453].sonyaToken.address;
const rSonyaTokenAddress = externalContracts[8453].rSonyaToken.address;

const StakingPage = () => {
  const { address } = useAccount();
  const { login, authenticated } = usePrivy();
  const { data: balance } = useWatchBalance({ address, token: sonyaTokenAddress });
  const { data: rSonyaBalance } = useWatchBalance({ address, token: rSonyaTokenAddress });

  const {
    stakingAmount,
    setStakingAmount,
    handleStake,
    handleApprove,
    setMaxAmount,
    isApproving,
    isStaking,
    hasAllowance,
  } = useStake();

  // Mock data
  const mockData = {
    totalStaked: "1234567",
    userStaked: rSonyaBalance?.formatted,
    userBalance: balance?.formatted,
  };

  const handleSetMaxAmount = () => {
    setMaxAmount(mockData.userBalance || "0");
  };

  const insufficientBalance = Number(stakingAmount) > Number(mockData.userBalance);

  return (
    <div className="h-screen bg-gradient-to-b from-base-200 to-base-300">
      <div className="container h-full max-w-5xl px-4 py-8 mx-auto overflow-y-auto">
        <div className="text-center">
          <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-center text-base-content">Stake SONYA</h1>
          <p className="mb-8 text-base text-center text-base-content/80">
            Stake your SONYA tokens to earn rSONYA and participate in governance
          </p>
        </div>

        <StakingStats totalStaked={mockData.totalStaked} userStaked={mockData.userStaked || "0"} />

        <div className="max-w-xl mx-auto">
          {!authenticated ? (
            <WelcomeCard onLogin={login} />
          ) : (
            <StakingForm
              stakingAmount={stakingAmount}
              setStakingAmount={setStakingAmount}
              userBalance={mockData.userBalance || "0"}
              onStakeSubmit={handleStake}
              onApproveSubmit={handleApprove}
              onSetMaxAmount={handleSetMaxAmount}
              insufficientBalance={insufficientBalance}
              isApproving={isApproving}
              isStaking={isStaking}
              hasAllowance={hasAllowance}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StakingPage;
