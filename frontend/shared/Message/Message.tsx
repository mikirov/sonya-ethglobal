"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { MessageProps, MessageRole } from "./type";
import classNames from "classnames";
import { motion } from "motion/react";

export const Message = ({ role, content, isLast }: MessageProps) => {
  console.log("🚀 ~ Message ~ role:", role);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLast) {
      setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  }, [isLast]);

  const isUserMessage = role === MessageRole.User;

  return (
    <motion.div
      ref={ref}
      className={classNames("flex gap-2 items-center rounded-2xl bg-base-300 p-2", {
        "!bg-accent": !isUserMessage,
      })}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{
        type: "spring",
        stiffness: 150,
        duration: 100,
      }}
    >
      {isUserMessage ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-user aspect-square !w-8 !h-8 flex-shrink-0"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ) : (
        <Image src="/sonya-square.png" alt="Sonya" width={32} height={32} className="w-8 h-8 rounded-full" />
      )}
      <div className="flex flex-col items-start">
        <div className="text-base-content font-semibold">{isUserMessage ? "You:" : "Sonya AI:"}</div>
        <div className="text-base-content">{content}</div>
      </div>
    </motion.div>
  );
};
