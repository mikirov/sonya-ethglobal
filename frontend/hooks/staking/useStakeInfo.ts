import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";

export const useStakeInfo = () => {
  const { address } = useAccount();
  const [stakeAmount, setStakeAmount] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(true);

  const { data: stakingContract } = useScaffoldContract({
    contractName: "staking",
  });

  useEffect(() => {
    const fetchStakeInfo = async () => {
      if (!address || !stakingContract) return;

      try {
        setIsLoading(true);
        const stake = await stakingContract.read.stakes([address]);
        // Convert from wei to ether (18 decimals)
        const formattedStake = stake ? (BigInt(stake.toString()) / 10n ** 18n).toString() : "0";
        setStakeAmount(formattedStake);
      } catch (error) {
        console.error("Error fetching stake info:", error);
        setStakeAmount("0");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStakeInfo();
  }, [address, stakingContract]);

  return {
    stakeAmount,
    isLoading,
    hasStake: parseFloat(stakeAmount) > 0,
  };
};
