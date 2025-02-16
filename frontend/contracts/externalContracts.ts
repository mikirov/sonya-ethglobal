import { erc20Abi } from "viem";
import { marketplaceAbi } from "~~/abis/marketplaceAbi";
import { rSonyaTokenAbi } from "~~/abis/rSonyaTokenAbi";
import { scheduleAbi } from "~~/abis/scheduleAbi";
import { sonyaTokenAbi } from "~~/abis/sonyaTokenAbi";
import { stakingAbi } from "~~/abis/stakingAbi";
import { usdSonyaTokenAbi } from "~~/abis/usdSonyaTokenAbi";
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

/**
 * @example
 * const externalContracts = {
 *   1: {
 *     DAI: {
 *       address: "0x...",
 *       abi: [...],
 *     },
 *   },
 * } as const;
 */
const externalContracts = {
  [8453]: {
    marketplace: {
      address: "0xe25D62ddC835EE16a1d6088F301539D2FEc13Fca",
      abi: marketplaceAbi,
    },
    staking: {
      address: "0x2510739C397EE720feed020C7c322db6E49D5A5e",
      abi: stakingAbi,
    },
    sonyaToken: {
      address: "0x7Bcbc36f7c4D5175B13Dfb789A3C360381D2F14D",
      abi: sonyaTokenAbi,
    },
    rSonyaToken: {
      address: "0xa90cC666AEfeB466Bc9e83009A35b084Bf9c6D66",
      abi: rSonyaTokenAbi,
    },
    usdSonyaToken: {
      address: "0x6fB55CD0230a98c7ed32ccD9B0FC7e6f4478eE12",
      abi: usdSonyaTokenAbi,
    },
    schedule: {
      address: "0xC1A6e8A2CBD6E61d3380Fc0690145de1D57c9c60",
      abi: scheduleAbi,
    },
    USDC: {
      address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
      abi: erc20Abi,
    },
    USDT: {
      address: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
      abi: erc20Abi,
    },
  },
} as const;

export default externalContracts satisfies GenericContractsDeclaration;
