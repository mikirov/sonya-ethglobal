import { useState } from "react";
import { BigNumber } from "bignumber.js";
import { useAccount } from "wagmi";
import externalContracts from "~~/contracts/externalContracts";
import { useScaffoldContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export const useTokenApproval = () => {
  const [isApproving, setIsApproving] = useState(false);
  const { address } = useAccount();

  const { data: sonyaToken } = useScaffoldContract({
    contractName: "sonyaToken",
  });

  const { writeContractAsync: approve } = useScaffoldWriteContract({
    contractName: "sonyaToken",
  });

  const checkAllowance = async (amount: string): Promise<boolean> => {
    if (!address || !sonyaToken || !amount) return false;

    const value = new BigNumber(amount).multipliedBy(10 ** 18);
    console.log("Checking allowance for amount:", amount, "converted to wei:", value.toString());

    const allowance = await sonyaToken.read.allowance([address, externalContracts[8453].staking.address]);
    console.log("Current allowance:", allowance?.toString());

    const hasAllowance = BigNumber(allowance?.toString() || "0").gte(value);
    console.log("Has sufficient allowance:", hasAllowance);

    return hasAllowance;
  };

  const approveToken = async (amount: string) => {
    if (!amount || !address) return false;

    try {
      setIsApproving(true);
      const value = new BigNumber(amount).multipliedBy(10 ** 18);
      console.log("Approving amount:", amount, "converted to wei:", value.toString());
      console.log("Approving spender:", externalContracts[8453].staking.address);

      await approve({
        functionName: "approve",
        args: [externalContracts[8453].staking.address, value],
      } as never);

      console.log("Token approval successful");
      return true;
    } catch (error) {
      console.error("Error approving tokens:", error);
      throw error;
    } finally {
      setIsApproving(false);
    }
  };

  return {
    isApproving,
    checkAllowance,
    approveToken,
  };
};
