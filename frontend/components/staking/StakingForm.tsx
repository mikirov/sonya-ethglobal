import { useEffect } from "react";
import { useAccount } from "wagmi";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import externalContracts from "~~/contracts/externalContracts";
import { useWatchBalance } from "~~/hooks/scaffold-eth";
import { useClaimSonyaRewards } from "~~/hooks/staking/useClaimSonyaRewards";
import { useStake } from "~~/hooks/staking/useStake";
import { useTokenApproval } from "~~/hooks/staking/useTokenApproval";

export const StakingForm = () => {
  const { address } = useAccount();
  const sonyaTokenAddress = externalContracts[8453].sonyaToken.address;
  const { data: userBalance } = useWatchBalance({ address, token: sonyaTokenAddress });

  const { stakingAmount, setStakingAmount, handleStake, setMaxAmount, isStaking } = useStake();
  const { handleClaimRewards, handleClaimVeRewards, isClaiming } = useClaimSonyaRewards();

  const { isApproving, checkAllowance, approveToken, hasAllowance } = useTokenApproval(
    "sonyaToken",
    externalContracts[8453].staking.address,
  );

  const insufficientBalance = Number(stakingAmount) > Number(userBalance?.formatted);
  const isInputValid = stakingAmount && !insufficientBalance;

  // Check allowance when amount changes
  useEffect(() => {
    if (stakingAmount) {
      checkAllowance(stakingAmount);
    }
  }, [stakingAmount, checkAllowance]);

  const handleApprove = async () => {
    if (!stakingAmount || !address) return;
    try {
      await approveToken(stakingAmount);
    } catch (error) {
      console.error("Error approving tokens:", error);
    }
  };

  return (
    <div className="p-6 transition-all rounded-2xl bg-base-100 hover:shadow-lg">
      <div className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="text-sm font-medium label-text">Amount to Stake</span>
          </label>
          <div className="relative">
            <input
              type="number"
              placeholder="0.0"
              className="w-full pr-24 border input input-sm focus:outline-none focus:ring-primary border-primary"
              value={stakingAmount}
              onChange={e => setStakingAmount(e.target.value)}
            />
            <div className="absolute transform -translate-y-1/2 right-4 top-1/2">
              <button
                onClick={() => setMaxAmount(userBalance?.formatted || "0")}
                className="px-2 mr-1 text-xs font-semibold text-primary hover:text-primary/80"
              >
                MAX
              </button>
              <span className="text-xs font-medium text-base-content/60">SONYA</span>
            </div>
          </div>
          <label className="label">
            <span className="text-xs label-text-alt">Balance: {userBalance?.formatted} SONYA</span>
            {insufficientBalance && (
              <a
                href="https://app.virtuals.io/prototypes/0x7Bcbc36f7c4D5175B13Dfb789A3C360381D2F14D"
                className="flex items-center text-xs text-primary hover:underline"
                rel="noopener noreferrer"
                target="_blank"
              >
                Get more SONYA tokens
                <ArrowTopRightOnSquareIcon className="inline-block w-4 h-4 ml-1" />
              </a>
            )}
          </label>
        </div>

        <div className="flex flex-col gap-2">
          {!hasAllowance && (
            <button
              onClick={handleApprove}
              disabled={!isInputValid || isApproving}
              className="w-full transition-all btn btn-primary btn-sm hover:brightness-105"
            >
              {isApproving ? "Approving..." : "Approve SONYA"}
            </button>
          )}

          <button
            onClick={handleStake}
            disabled={!isInputValid || !hasAllowance || isStaking}
            className="w-full transition-all btn btn-primary btn-sm hover:brightness-105"
          >
            {insufficientBalance
              ? "Insufficient Balance"
              : isStaking
                ? "Staking..."
                : !hasAllowance
                  ? "Approve SONYA First"
                  : "Stake SONYA"}
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleClaimRewards}
              disabled={isClaiming}
              className="flex-1 transition-all btn btn-secondary btn-sm hover:brightness-105"
            >
              {isClaiming ? "Claiming..." : "Claim SONYA"}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-center text-base-content/60">
            Make sure you have enough SONYA tokens in your wallet before staking
          </p>
        </div>
      </div>
    </div>
  );
};
