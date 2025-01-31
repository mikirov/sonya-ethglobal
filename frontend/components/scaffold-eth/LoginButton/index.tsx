"use client";

// @refresh reset
import { AddressInfoDropdown } from "./AddressInfoDropdown";
import { AddressQRCodeModal } from "./AddressQRCodeModal";
import { WrongNetworkDropdown } from "./WrongNetworkDropdown";
import { usePrivy } from "@privy-io/react-auth";
import { Address } from "viem";
import { useAccount } from "wagmi";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { getBlockExplorerAddressLink } from "~~/utils/scaffold-eth";

/**
 * Custom Privy Login Button (watch balance + custom design)
 */
export const LoginButton = () => {
  const { targetNetwork } = useTargetNetwork();
  const { login, ready, authenticated } = usePrivy();
  const { chain, address } = useAccount();

  if (!ready) {
    return null;
  }

  return (
    <>
      {(() => {
        if (!authenticated) {
          return (
            <button className="btn btn-primary btn-sm" onClick={login} type="button">
              Connect Wallet
            </button>
          );
        }

        if (!chain || chain.id !== targetNetwork.id) {
          return <WrongNetworkDropdown />;
        }

        const blockExplorerAddressLink = address ? getBlockExplorerAddressLink(targetNetwork, address) : undefined;

        return (
          <>
            <AddressInfoDropdown
              address={address as Address}
              displayName={address as string}
              ensAvatar={undefined}
              blockExplorerAddressLink={blockExplorerAddressLink}
            />
            <AddressQRCodeModal address={address as Address} modalId="qrcode-modal" />
          </>
        );
      })()}
    </>
  );
};
