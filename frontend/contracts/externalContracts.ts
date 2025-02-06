import { marketplaceAbi } from "~~/abis/marketplaceAbi";
import { rSonyaTokenAbi } from "~~/abis/rSonyaTokenAbi";
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
      address: "0xe7Cca1381218fF907447D68714FAfcA74feF6273",
      abi: stakingAbi,
    },
    sonyaToken: {
      address: "0x7Bcbc36f7c4D5175B13Dfb789A3C360381D2F14D",
      abi: sonyaTokenAbi,
    },
    rSonyaToken: {
      address: "0x6fDbf57c09a7f75c354BEE3769b6A347ebcD3b54",
      abi: rSonyaTokenAbi,
    },
    usdSonyaToken: {
      address: "0x6fB55CD0230a98c7ed32ccD9B0FC7e6f4478eE12",
      abi: usdSonyaTokenAbi,
    },
  },
} as const;

export default externalContracts satisfies GenericContractsDeclaration;
