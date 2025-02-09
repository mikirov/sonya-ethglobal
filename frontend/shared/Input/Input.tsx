"use client";

import { FormEvent, useState } from "react";

export const Input = ({ isLoading, handleSend }: { isLoading: boolean; handleSend: (input: string) => void }) => {
  const [input, setInput] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    handleSend(input);
    setInput("");
  };

  return (
    <div className="w-full flex flex-col">
      <form className="w-full" onSubmit={onSubmit}>
        <div className="flex justify-between items-center gap-2 bg-base-100 px-3 rounded-2xl">
          <input type="submit" hidden />
          <input
            className="relative bg-transparent w-full placeholder:text-base-content/50 p-3 focus:outline-none text-base-content"
            placeholder="Type your message here"
            style={{ height: "60px", fontSize: "1rem" }}
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button className="h-fit bg-primary hover:bg-primary-focus font-semibold flex items-center justify-center text-base-content px-4 py-2 rounded-2xl">
            {isLoading ? <span className="loading loading-ring loading-sm"></span> : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
};
