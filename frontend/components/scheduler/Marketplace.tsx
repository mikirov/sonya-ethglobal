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

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="container max-w-2xl p-8 mx-auto border rounded-lg bg-base-100 border-base-300 hover:shadow-xl">
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

        <form onSubmit={handleDeposit} className="space-y-4">
          <div className="form-control">
            <label className="py-1 label">
              <span className="text-sm font-medium label-text">Select Token</span>
            </label>
            <select
              className="w-full h-10 input input-bordered focus:input-primary"
              value={selectedToken}
              onChange={e => setSelectedToken(e.target.value as "USDC" | "USDT")}
              required
            >
              <option value="USDC">USDC</option>
              <option value="USDT">USDT</option>
            </select>
          </div>

          <div className="form-control">
            <label className="py-1 label">
              <span className="text-sm font-medium label-text">Amount (min $50)</span>
            </label>
            <input
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Enter amount"
              type="number"
              className="w-full h-10 input input-bordered focus:input-primary"
              required
            />
          </div>

          <button type="submit" className="w-full h-10 transition-all btn btn-primary hover:brightness-105">
            Deposit {selectedToken}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Marketplace;
