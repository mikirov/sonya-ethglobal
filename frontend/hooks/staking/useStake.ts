import { useEffect, useState } from "react";
import { useTokenApproval } from "./useTokenApproval";
import { BigNumber } from "bignumber.js";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export const useStake = () => {
  const [stakingAmount, setStakingAmount] = useState("");
  const [isStaking, setIsStaking] = useState(false);
  const [hasAllowance, setHasAllowance] = useState(false);
  const { address } = useAccount();
  const { isApproving, checkAllowance, approveToken } = useTokenApproval();

  const { writeContractAsync: stake } = useScaffoldWriteContract({
    contractName: "staking",
  });

  const checkCurrentAllowance = async (amount: string) => {
    if (!amount || !address) return;
    const allowed = await checkAllowance(amount);
    setHasAllowance(allowed);
    return allowed;
  };

  const handleApprove = async () => {
    if (!stakingAmount || !address) return;
    try {
      await approveToken(stakingAmount);
      await checkCurrentAllowance(stakingAmount);
    } catch (error) {
      console.error("Error approving tokens:", error);
      throw error;
    }
  };

  const handleStake = async () => {
    if (!stakingAmount || !address) return;

    try {
      const hasAllowance = await checkCurrentAllowance(stakingAmount);
      if (!hasAllowance) {
        throw new Error("Insufficient allowance");
      }

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
    checkCurrentAllowance(maxAmount);
  };

  // Check allowance when amount changes
  useEffect(() => {
    if (stakingAmount) {
      checkCurrentAllowance(stakingAmount);
    }
  }, [stakingAmount]);

  return {
    stakingAmount,
    setStakingAmount,
    handleStake,
    handleApprove,
    setMaxAmount,
    isApproving,
    isStaking,
    hasAllowance,
  };
};
