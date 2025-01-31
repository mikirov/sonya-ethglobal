"use client";

import Image from "next/image";
import { blo } from "blo";

interface BlockieAvatarProps {
  address?: string;
  ensImage?: string;
  size?: number;
}

export const BlockieAvatar = ({ address, ensImage, size = 24 }: BlockieAvatarProps) => {
  if (!address) return null;

  return (
    <div className="avatar">
      <div className={`w-${size} rounded-full`}>
        <Image src={ensImage || blo(address as `0x${string}`)} alt={`${address} avatar`} />
      </div>
    </div>
  );
};
