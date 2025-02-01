"use client";

export const Input = ({ input, setInput }: { input: string; setInput: (input: string) => void }) => {
  return (
    <div className="w-full flex flex-col">
      <div className="flex justify-between items-center gap-2 bg-base-100 px-3 rounded-2xl">
        <input type="submit" hidden />
        <input
          className="relative bg-transparent w-full placeholder:text-base-content/50 p-3 focus:outline-none text-base-content"
          placeholder="Type your message here"
          style={{ height: "60px", fontSize: "1rem" }}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button className="h-fit bg-primary hover:bg-primary-focus font-semibold text-base-content px-4 py-2 rounded-2xl">
          Send
        </button>
      </div>
    </div>
  );
};
