import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useSignTypedData } from "@privy-io/react-auth";
import { useAccount, useSignTypedData as useWagmiSignTypedData } from "wagmi";
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
};

export const useStakePermit = () => {
  const [stakingAmount, setStakingAmount] = useState("");
  const { address } = useAccount();
  const { user } = usePrivy();

  const { writeContractAsync: stakeWithPermit } = useScaffoldWriteContract({
    contractName: "staking",
  });

  const { signTypedData } = useSignTypedData();
  const { signTypedDataAsync } = useWagmiSignTypedData();

  const handleStake = async (amount: string) => {
    console.log("Starting handleStake with amount:", amount, "address:", address);
    if (!amount || !address) return;

    try {
      const deadline = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour from now
      const value = BigInt(amount);
      console.log("Calculated deadline:", deadline, "Parsed value:", value.toString());

      const message = {
        owner: address,
        spender: externalContracts[8453].staking.address,
        value,
        nonce: BigInt(0),
        deadline: BigInt(deadline),
      };
      console.log("Constructed message:", message);

      console.log("Attempting to sign typed data with domain:", domain);
      let signature: string;
      switch (user?.linkedAccounts[0].type) {
        case "email": {
          const { signature: emailSignature } = await signTypedData({
            domain,
            types,
            primaryType: "Permit",
            message,
          });
          signature = emailSignature;
          break;
        }
        case "wallet": {
          const walletSignature = await signTypedDataAsync({
            domain,
            types,
            primaryType: "Permit",
            message,
          });
          signature = walletSignature;
          break;
        }
        default: {
          const { signature: defaultSignature } = await signTypedData({
            domain,
            types,
            primaryType: "Permit",
            message,
          });
          signature = defaultSignature;
        }
      }

      if (!signature) throw new Error("Failed to sign");

      const { r, s, v } = {
        r: signature.slice(0, 66),
        s: "0x" + signature.slice(66, 130),
        v: parseInt(signature.slice(130, 132), 16),
      };
      console.log("Parsed signature components - r:", r, "s:", s, "v:", v);

      console.log("Calling stakeWithPermit with args:", [value, deadline, v, r, s]);
      await stakeWithPermit({
        functionName: "stakeWithPermit",
        args: [value, deadline, v, r, s],
      } as never);
      console.log("stakeWithPermit call successful");
    } catch (error) {
      console.error("Error staking tokens:", error);
      console.error("Error details:", {
        error,
        stackTrace: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  };

  const handleStakeSubmit = async () => {
    console.log("Starting handleStakeSubmit with amount:", stakingAmount);
    try {
      await handleStake(stakingAmount);
      setStakingAmount("");
      console.log("Stake submitted successfully");
    } catch (error) {
      console.error("Failed to stake:", error);
      console.error("Error details:", {
        error,
        stackTrace: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  };

  const setMaxAmount = (maxAmount: string) => {
    console.log("Setting max amount:", maxAmount);
    setStakingAmount(maxAmount);
  };

  return {
    stakingAmount,
    setStakingAmount,
    handleStakeSubmit,
    setMaxAmount,
  };
};
