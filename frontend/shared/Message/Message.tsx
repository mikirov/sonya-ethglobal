"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MessageProps, MessageRole } from "./type";
import classNames from "classnames";
import { motion, useInView } from "motion/react";

export const Message = ({ role, content, isLast }: MessageProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const isInView = useInView(ref);

  useEffect(() => {
    if (isLast && isInView) {
      setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  }, [isLast, isInView]);

  const isUser = role === MessageRole.User;

  return (
    <motion.div
      ref={ref}
      className={classNames("flex gap-2 items-center rounded-2xl bg-base-200 p-2", {
        "!hover:bg-base-300": hovered,
      })}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{
        type: "spring",
        stiffness: 150,
        duration: 100,
      }}
      onMouseOver={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {isUser ? (
        <div className="w-8 h-8 rounded-full bg-base-300 aspect-square" />
      ) : (
        <Image src="/sonya-square.png" alt="Sonya" width={32} height={32} className="w-8 h-8 rounded-full" />
      )}
      <div className="flex flex-col items-start">
        <div className="text-base-content font-semibold">{isUser ? "You:" : "Sonya AI:"}</div>
        <div className="text-base-content">{content}</div>
      </div>
    </motion.div>
  );
};
