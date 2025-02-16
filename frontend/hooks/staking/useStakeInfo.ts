import { useCallback, useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";

// Simple cache
let cachedStakeAmount = "0";

export const useStakeInfo = () => {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const { data: stakingContract } = useScaffoldContract({ contractName: "staking" });

  const fetchStakeInfo = useCallback(async () => {
    if (!address || !stakingContract) return "0";

    setIsLoading(true);
    try {
      const stake = await stakingContract.read.stakes([address]);
      cachedStakeAmount = stake ? (BigInt(stake.toString()) / 10n ** 18n).toString() : "0";
      console.log("💰 Stake info for", address, ":", {
        amount: cachedStakeAmount,
        hasStake: parseFloat(cachedStakeAmount) > 0,
      });
      return cachedStakeAmount;
    } catch (error) {
      console.error("Error fetching stake info:", error);
      return "0";
    } finally {
      setIsLoading(false);
    }
  }, [address, stakingContract]);

  return {
    stakeAmount: cachedStakeAmount,
    isLoading,
    hasStake: parseFloat(cachedStakeAmount) > 0,
    refetch: fetchStakeInfo,
  };
};
