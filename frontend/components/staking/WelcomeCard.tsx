import { useLogin } from "@privy-io/react-auth";

export const WelcomeCard = () => {
  const { login } = useLogin();

  return (
    <div className="py-8 border shadow-lg bg-base-200/60 rounded-2xl border-base-300 backdrop-blur-md">
      <div className="container flex flex-col items-center justify-center max-w-3xl px-4 mx-auto">
        <div className="p-4 text-center">
          <h3 className="mb-3 text-2xl font-extrabold tracking-tight text-base-content">Welcome to SONYA Staking</h3>
          <p className="mb-4 text-sm leading-relaxed text-base-content/70">
            To start staking your SONYA tokens and unlock exclusive benefits, connect your wallet first. By staking,
            you&apos;ll earn rSONYA tokens which represent your staked position. rSONYA tokens enable you to participate
            in governance and earn rewards while your SONYA tokens remain securely staked.
          </p>
          <button onClick={login} className="text-white btn btn-primary btn-sm">
            Connect to Sonya AI
          </button>
        </div>
      </div>
    </div>
  );
};
