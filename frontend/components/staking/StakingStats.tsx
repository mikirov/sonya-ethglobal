import { formatNumber } from "./utils";

interface StakingStatsProps {
  totalStaked: string;
  userStaked: string;
  veSONYA: string;
}

export const StakingStats = ({ totalStaked, userStaked, veSONYA }: StakingStatsProps) => {
  return (
    <div className="grid gap-6 mb-8 md:grid-cols-3">
      {[
        { title: "Total Staked", value: formatNumber(totalStaked) },
        { title: "Your Stake", value: formatNumber(userStaked) },
        { title: "Your veSONYA", value: formatNumber(veSONYA) },
      ].map((stat, i) => (
        <div
          key={i}
          className="flex flex-col justify-end p-4 text-center transition-all rounded-xl bg-base-100 hover:shadow-lg"
        >
          <div className="text-2xl font-bold text-center text-base-content">{stat.value}</div>
          <div className="mt-1 text-xs font-medium text-center text-base-content/60">{stat.title}</div>
        </div>
      ))}
    </div>
  );
};
