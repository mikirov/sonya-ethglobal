import { formatNumber } from "~~/utils/formatNumber";

interface StakingStatsProps {
  totalStaked: string;
  userStaked: string;
}

export const StakingStats = ({ totalStaked, userStaked }: StakingStatsProps) => {
  return (
    <div className="grid gap-6 mb-8 md:grid-cols-3">
      {[
        { title: "Total Staked (rSONYA)", value: formatNumber(+totalStaked) },
        { title: "Your Stake (rSONYA)", value: `${formatNumber(+userStaked)}` },
        { title: "Average APR", value: "6.9%" },
      ].map((stat, i) => (
        <div
          key={i}
          className="flex flex-col justify-end p-4 text-center transition-all rounded-xl bg-base-100 hover:shadow-lg"
        >
          <div className="flex items-center justify-center gap-2">
            <div className="text-2xl font-bold text-center text-base-content">{stat.value}</div>
          </div>
          <div className="mt-1 text-xs font-medium text-center text-base-content/60">{stat.title}</div>
        </div>
      ))}
    </div>
  );
};
