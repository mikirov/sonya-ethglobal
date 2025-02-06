import { useState } from "react";
import { parseEther } from "viem";
import { useAccount, useSignTypedData } from "wagmi";
import externalContracts from "~~/contracts/externalContracts";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const domain = {
  name: "SONYA Token",
  version: "1",
  chainId: 8453,
  verifyingContract: externalContracts[8453].sonyaToken.address,
} as const;

const types = {
  Permit: [
    { name: "owner", type: "address" },
    { name: "spender", type: "address" },
    { name: "value", type: "uint256" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" },
  ],
} as const;

export const useStake = () => {
  const [stakingAmount, setStakingAmount] = useState("");
  const { address } = useAccount();

  const { writeContractAsync: stakeWithPermit } = useScaffoldWriteContract({
    contractName: "staking",
  });

  const { signTypedDataAsync } = useSignTypedData();

  const handleStake = async (amount: string) => {
    if (!amount || !address) return;

    try {
      const deadline = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour from now
      const value = parseEther(amount);

      const message = {
        owner: address,
        spender: externalContracts[8453].staking.address,
        value,
        nonce: BigInt(0),
        deadline: BigInt(deadline),
      };

      const signature = await signTypedDataAsync({
        domain,
        types,
        primaryType: "Permit",
        message,
      });

      if (!signature) throw new Error("Failed to sign");

      const { r, s, v } = {
        r: signature.slice(0, 66),
        s: "0x" + signature.slice(66, 130),
        v: parseInt(signature.slice(130, 132), 16),
      };

      await stakeWithPermit({
        functionName: "stakeWithPermit",
        args: [value, deadline, v, r, s],
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
