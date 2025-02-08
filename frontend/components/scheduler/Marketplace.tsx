"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import externalContracts from "~~/contracts/externalContracts";
import { useScaffoldContract, useScaffoldWriteContract, useWatchBalance } from "~~/hooks/scaffold-eth";

const usdcAddress = externalContracts[8453].USDC.address;
const usdtAddress = externalContracts[8453].USDT.address;
const usdSonyaTokenAddress = externalContracts[8453].usdSonyaToken.address;

const Marketplace = () => {
  const { authenticated } = usePrivy();
  const { address } = useAccount();
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState<"USDC" | "USDT">("USDC");

  const { data: marketplaceContract } = useScaffoldContract({
    contractName: "marketplace",
  });

  const { data: usdcBalance } = useWatchBalance({ address, token: usdcAddress });
  const { data: usdtBalance } = useWatchBalance({ address, token: usdtAddress });
  const { data: sonyaBalance } = useWatchBalance({ address, token: usdSonyaTokenAddress });

  const { writeContractAsync: depositUSDC } = useScaffoldWriteContract({
    contractName: "marketplace",
  });

  const { writeContractAsync: depositUSDT } = useScaffoldWriteContract({
    contractName: "marketplace",
  });

  const handleDeposit = async () => {
    if (!amount) return;
    try {
      const amountInWei = BigInt(parseFloat(amount) * 1e6);

      if (selectedToken === "USDC") {
        await depositUSDC({
          functionName: "depositUSDC",
          args: [amountInWei],
        } as never);
      } else {
        await depositUSDT({
          functionName: "depositUSDT",
          args: [amountInWei],
        } as never);
      }
    } catch (error) {
      console.error("Error depositing:", error);
    }
  };

  if (!authenticated) {
    return (
      <div className="p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold">Please connect your wallet</h2>
        <p>You need to connect your wallet to use the marketplace</p>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl p-8 mx-auto">
      <h1 className="mb-8 text-3xl font-bold text-center">Token Marketplace</h1>

      <div className="p-6 rounded-lg bg-base-200">
        <div className="mb-6">
          <h3 className="mb-2 text-lg font-semibold">Your Balances</h3>
          <div className="space-y-2">
            <p>USDC: {usdcBalance?.formatted || "0"}</p>
            <p>USDT: {usdtBalance?.formatted || "0"}</p>
            <p>SONYA: {sonyaBalance?.formatted || "0"}</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-2">Select Token</label>
          <select
            className="w-full p-2 rounded-lg bg-base-100"
            value={selectedToken}
            onChange={e => setSelectedToken(e.target.value as "USDC" | "USDT")}
          >
            <option value="USDC">USDC</option>
            <option value="USDT">USDT</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block mb-2">Amount (min $50)</label>
          <input
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Enter amount"
            type="number"
            className="w-full p-2 rounded-lg bg-base-100"
          />
        </div>

        <button className="w-full py-2 font-bold rounded-lg bg-primary hover:bg-primary/80" onClick={handleDeposit}>
          Deposit {selectedToken}
        </button>
      </div>
    </div>
  );
};

export default Marketplace;
