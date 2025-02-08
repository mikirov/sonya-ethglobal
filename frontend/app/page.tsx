"use client";

import { usePrivy } from "@privy-io/react-auth";
import type { NextPage } from "next";
import { SonyaCharacter } from "~~/components/SonyaCharacter";
import { useInitializeNativeCurrencyPrice } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  useInitializeNativeCurrencyPrice();
  const { login, authenticated } = usePrivy();

  return (
    <main className="relative flex flex-col flex-1 h-full overflow-hidden">
      {!authenticated ? (
        <div className="relative py-24 border bg-gradient-to-br from-base-200/95 via-base-200/90 to-base-200/80 rounded-[2.5rem] border-base-300/50 backdrop-blur-xl overflow-y-auto">
          <div className="relative flex flex-col items-center justify-center max-w-4xl px-8 mx-auto ">
            <div className="p-10 text-center">
              <h3 className="mb-6 text-5xl font-black tracking-tight text-transparent bg-gradient-to-br from-base-content to-base-content/70 bg-clip-text">
                Welcome to Sonya AI Chat
              </h3>

              <p className="max-w-2xl mx-auto mb-12 text-lg leading-relaxed text-base-content/70">
                Experience the next generation of AI assistance. Connect your wallet to begin your journey with Sonya AI
                and unlock personalized insights to transform your business.
              </p>

              <button
                onClick={login}
                className="px-8 mb-12 text-lg font-bold text-center text-white transition-all btn btn-accent hover:scale-105"
              >
                Connect to Sonya AI
              </button>

              <div className="grid gap-4 mx-auto mb-12 md:grid-cols-3">
                <div className="relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-base-100/40 to-base-100/80 backdrop-blur-xl rounded-3xl" />
                  <div className="relative p-8 transition-all duration-500 hover:transform hover:scale-[1.02]">
                    <div className="inline-flex items-center justify-center w-12 h-12 mb-6 transition-all duration-300 rounded-2xl bg-primary/20 text-primary group-hover:scale-110 group-hover:bg-primary/30">
                      <div className="text-2xl">🤖</div>
                    </div>
                    <h4 className="mb-3 text-xl font-medium text-base-content">AI Assistance</h4>
                    <p className="text-base leading-relaxed text-base-content/70">
                      Personalized support tailored to your needs
                    </p>
                    <div className="absolute bottom-0 left-0 right-0 h-1 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 group-hover:opacity-100" />
                  </div>
                </div>

                <div className="relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-base-100/40 to-base-100/80 backdrop-blur-xl rounded-3xl" />
                  <div className="relative p-8 transition-all duration-500 hover:transform hover:scale-[1.02]">
                    <div className="inline-flex items-center justify-center w-12 h-12 mb-6 transition-all duration-300 rounded-2xl bg-primary/20 text-primary group-hover:scale-110 group-hover:bg-primary/30">
                      <div className="text-2xl">📈</div>
                    </div>
                    <h4 className="mb-3 text-xl font-medium text-base-content">Growth Insights</h4>
                    <p className="text-base leading-relaxed text-base-content/70">Data-driven strategies for success</p>
                    <div className="absolute bottom-0 left-0 right-0 h-1 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 group-hover:opacity-100" />
                  </div>
                </div>

                <div className="relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-base-100/40 to-base-100/80 backdrop-blur-xl rounded-3xl" />
                  <div className="relative p-8 transition-all duration-500 hover:transform hover:scale-[1.02]">
                    <div className="inline-flex items-center justify-center w-12 h-12 mb-6 transition-all duration-300 rounded-2xl bg-primary/20 text-primary group-hover:scale-110 group-hover:bg-primary/30">
                      <div className="text-2xl">⚡</div>
                    </div>
                    <h4 className="mb-3 text-xl font-medium text-base-content">24/7 Support</h4>
                    <p className="text-base leading-relaxed text-base-content/70">
                      Always available when you need help
                    </p>
                    <div className="absolute bottom-0 left-0 right-0 h-1 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 group-hover:opacity-100" />
                  </div>
                </div>
              </div>

              <button
                onClick={login}
                className="px-8 text-lg font-bold text-center text-white transition-all md:hidden btn btn-accent hover:scale-105"
              >
                Connect to Sonya AI
              </button>
            </div>
          </div>
        </div>
      ) : (
        <SonyaCharacter />
      )}
    </main>
  );
};

export default Home;
