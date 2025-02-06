import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

interface StakingFormProps {
  stakingAmount: string;
  setStakingAmount: (value: string) => void;
  userBalance: string;
  onStakeSubmit: () => Promise<void>;
  onSetMaxAmount: () => void;
  insufficientBalance: boolean;
}

export const StakingForm = ({
  stakingAmount,
  setStakingAmount,
  userBalance,
  onStakeSubmit,
  onSetMaxAmount,
  insufficientBalance,
}: StakingFormProps) => {
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
                onClick={onSetMaxAmount}
                className="px-2 mr-1 text-xs font-semibold text-primary hover:text-primary/80"
              >
                MAX
              </button>
              <span className="text-xs font-medium text-base-content/60">SONYA</span>
            </div>
          </div>
          <label className="label">
            <span className="text-xs label-text-alt">Balance: {userBalance} SONYA</span>
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

        <button
          onClick={onStakeSubmit}
          disabled={insufficientBalance}
          className="w-full transition-all btn btn-primary btn-sm hover:brightness-105"
        >
          {insufficientBalance ? "Insufficient Balance" : "Stake SONYA"}
        </button>

        <div className="space-y-1">
          <p className="text-xs text-center text-base-content/60">
            Make sure you have enough SONYA tokens in your wallet before staking
          </p>
        </div>
      </div>
    </div>
  );
};
