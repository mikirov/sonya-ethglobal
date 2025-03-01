"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SwitchTheme } from "./SwitchTheme";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { LoginButton } from "~~/components/scaffold-eth";
import externalContracts from "~~/contracts/externalContracts";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import { useWatchBalance } from "~~/hooks/scaffold-eth";
import { useScheduleInfo } from "~~/hooks/schedule/useScheduleInfo";
import { useStakeInfo } from "~~/hooks/staking/useStakeInfo";

const rSonyaTokenAddress = externalContracts[8453].rSonyaToken.address;
const marketplaceTokenAddress = externalContracts[8453].usdSonyaToken.address;

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const HeaderMenuLinks = () => {
  const pathname = usePathname();
  const { authenticated } = usePrivy();
  const { hasStake } = useStakeInfo();
  const { hasActiveAppointment } = useScheduleInfo();
  const { address } = useAccount();
  const { data: marketplaceBalance } = useWatchBalance({ address, token: marketplaceTokenAddress });

  const menuLinks: HeaderMenuLink[] = [
    {
      label: "Stake",
      href: "/stake",
    },
  ];

  // Add Schedule link if user has staked or marketplace balance
  if (authenticated && (hasStake || (marketplaceBalance && parseFloat(marketplaceBalance.formatted) > 0))) {
    menuLinks.push({
      label: "Schedule",
      href: "/schedule",
    });
  }

  // Always show Chat link
  menuLinks.push({
    label: "Chat",
    href: "/chat",
  });

  // Always show marketplace
  menuLinks.push({
    label: "Marketplace",
    href: "/marketplace",
  });

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "bg-secondary shadow-md" : ""
              } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  return (
    <div className="sticky top-0 z-20 justify-between flex-shrink-0 min-h-0 px-0 shadow-md navbar bg-base-100 shadow-secondary sm:px-2">
      <div className="w-auto navbar-start lg:w-1/2">
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
            onClick={() => {
              setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-1/2" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="p-2 mt-3 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              <HeaderMenuLinks />
            </ul>
          )}
        </div>
        <div className="flex items-center">
          <Link href="/" className="ml-2 mr-4 text-xl font-bold tracking-tight text-base-content hover:text-primary">
            Sonya AI
          </Link>
        </div>
        <ul className="hidden gap-2 px-1 lg:flex lg:flex-nowrap menu menu-horizontal">
          <HeaderMenuLinks />
        </ul>
      </div>
      <div className="flex-grow mr-4 navbar-end">
        <SwitchTheme className="mr-2" />
        <LoginButton />
      </div>
    </div>
  );
};
