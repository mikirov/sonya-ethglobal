import { useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export const useClaimSonyaRewards = () => {
  const [isClaiming, setIsClaiming] = useState(false);
  const { address } = useAccount();

  const { writeContractAsync: claimRewards } = useScaffoldWriteContract({
    contractName: "staking",
  });

  const handleClaimRewards = async () => {
    if (!address) return;

    try {
      setIsClaiming(true);
      console.log("Claiming rewards...");

      await claimRewards({
        functionName: "claimRewards",
      } as never);

      console.log("Rewards claimed successfully");
    } catch (error) {
      console.error("Error claiming rewards:", error);
      throw error;
    } finally {
      setIsClaiming(false);
    }
  };

  const handleClaimVeRewards = async () => {
    if (!address) return;

    try {
      setIsClaiming(true);
      console.log("Claiming veSONYA rewards...");

      await claimRewards({
        functionName: "claimVeRewards",
      } as never);

      console.log("veSONYA rewards claimed successfully");
    } catch (error) {
      console.error("Error claiming veSONYA rewards:", error);
      throw error;
    } finally {
      setIsClaiming(false);
    }
  };

  return {
    handleClaimRewards,
    handleClaimVeRewards,
    isClaiming,
  };
};
