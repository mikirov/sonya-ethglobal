import { useCallback, useState } from "react";
import { BigNumber } from "bignumber.js";
import { useAccount } from "wagmi";
import { useScaffoldContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export const useTokenApproval = (tokenContractName: string, spenderAddress: string) => {
  const [isApproving, setIsApproving] = useState(false);
  const [hasAllowance, setHasAllowance] = useState(false);
  const { address } = useAccount();

  const { data: tokenContract } = useScaffoldContract({
    contractName: tokenContractName as any, // make sure to enter the correct contract name in props
  });

  const { writeContractAsync: approve } = useScaffoldWriteContract({
    contractName: tokenContractName as any, // make sure to enter the correct contract name in props
  });

  const checkAllowance = useCallback(
    async (amount: string): Promise<void> => {
      if (!address || !tokenContract || !amount) {
        setHasAllowance(false);
        return;
      }

      const value = new BigNumber(amount).multipliedBy(10 ** 18);
      console.log("Checking allowance for amount:", amount, "converted to wei:", value.toString());

      const allowance = await tokenContract.read.allowance([address, spenderAddress]);
      console.log("Current allowance:", allowance?.toString());

      const allowed = BigNumber(allowance?.toString() || "0").gte(value);
      console.log("Has sufficient allowance:", allowed);

      setHasAllowance(allowed);
    },
    [address, tokenContract, spenderAddress],
  );

  const approveToken = async (amount: string) => {
    if (!amount || !address) return;

    try {
      setIsApproving(true);
      const value = new BigNumber(amount).multipliedBy(10 ** 18);
      console.log("Approving amount:", amount, "converted to wei:", value.toString());
      console.log("Approving spender:", spenderAddress);

      await approve({
        functionName: "approve",
        args: [spenderAddress, value],
      } as never);

      console.log("Token approval successful");
      await checkAllowance(amount);
    } catch (error) {
      console.error("Error approving tokens:", error);
      throw error;
    } finally {
      setIsApproving(false);
    }
  };

  return {
    isApproving,
    hasAllowance,
    checkAllowance,
    approveToken,
  };
};
