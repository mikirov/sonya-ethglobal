import { createConfig } from "@privy-io/wagmi";
import { Chain, createClient, fallback, http } from "viem";
import { base, hardhat } from "viem/chains";
import scaffoldConfig, { DEFAULT_ALCHEMY_API_KEY } from "~~/scaffold.config";
import { getAlchemyHttpUrl } from "~~/utils/scaffold-eth";

const { targetNetworks } = scaffoldConfig;

// We always want to have mainnet enabled (ENS resolution, ETH price, etc). But only once.
export const enabledChains = targetNetworks.find((network: Chain) => network.id === 8453)
  ? targetNetworks
  : ([...targetNetworks, base] as const);

export const wagmiConfig = createConfig({
  chains: enabledChains,
  ssr: true,
  client({ chain }) {
    let rpcFallbacks = [http()];

    const alchemyHttpUrl = getAlchemyHttpUrl(chain.id);
    console.log("Alchemy HTTP URL:", alchemyHttpUrl);

    if (alchemyHttpUrl) {
      const isUsingDefaultKey = scaffoldConfig.alchemyApiKey === DEFAULT_ALCHEMY_API_KEY;
      // If using default Scaffold-ETH 2 API key, we prioritize the default RPC
      rpcFallbacks = isUsingDefaultKey ? [http(), http(alchemyHttpUrl)] : [http(alchemyHttpUrl), http()];
    }

    return createClient({
      chain,
      transport: fallback(rpcFallbacks),
      ...(chain.id !== (hardhat as Chain).id
        ? {
            pollingInterval: scaffoldConfig.pollingInterval,
          }
        : {}),
    });
  },
});
