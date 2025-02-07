import { useState } from "react";
import { BigNumber } from "bignumber.js";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export const useStake = () => {
  const [stakingAmount, setStakingAmount] = useState("");
  const [isStaking, setIsStaking] = useState(false);
  const { address } = useAccount();

  const { writeContractAsync: stake } = useScaffoldWriteContract({
    contractName: "staking",
  });

  const handleStake = async () => {
    if (!stakingAmount || !address) return;

    try {
      setIsStaking(true);
      const value = new BigNumber(stakingAmount).multipliedBy(10 ** 18);

      console.log("Staking tokens...");
      await stake({
        functionName: "stake",
        args: [value],
      } as never);

      console.log("Staking successful");
      setStakingAmount("");
    } catch (error) {
      console.error("Error staking tokens:", error);
      throw error;
    } finally {
      setIsStaking(false);
    }
  };

  const setMaxAmount = (maxAmount: string) => {
    setStakingAmount(maxAmount);
  };

  return {
    stakingAmount,
    setStakingAmount,
    handleStake,
    setMaxAmount,
    isStaking,
  };
};
