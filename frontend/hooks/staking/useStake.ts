import { useState } from "react";
import { parseEther } from "viem";
import externalContracts from "~~/contracts/externalContracts";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const sonyaTokenAddress = externalContracts[8453].sonyaToken.address;

export const useStake = () => {
  const [stakingAmount, setStakingAmount] = useState("");

  const { writeContractAsync: stake } = useScaffoldWriteContract({
    contractName: "staking",
  });

  const { writeContractAsync: stakeWithPermit } = useScaffoldWriteContract({
    contractName: "staking",
  });

  const handleStake = async (amount: string) => {
    if (!amount) return;

    try {
      const amountInWei = parseEther(amount);

      // TODO: Add deadline and signature for Permit
      const deadline = Math.floor(Date.now() / 1000) + 1000 * 60 * 60 * 24 * 365; // 1 year from now
      const v = 27; // Standard EIP-2612 signature
      const r = "0x" + "0".repeat(64); // Empty r value
      const s = "0x" + "0".repeat(64); // Empty s value

      await stakeWithPermit({
        functionName: "stakeWithPermit",
        args: [amountInWei, deadline, v, r, s],
      } as never);
    } catch (error) {
      console.error("Error staking tokens:", error);
      throw error;
    }
  };

  const handleStakeSubmit = async () => {
    try {
      await handleStake(stakingAmount);
      setStakingAmount("");
    } catch (error) {
      console.error("Failed to stake:", error);
      throw error;
    }
  };

  const setMaxAmount = (maxAmount: string) => {
    setStakingAmount(maxAmount);
  };

  return {
    stakingAmount,
    setStakingAmount,
    handleStakeSubmit,
    setMaxAmount,
  };
};
