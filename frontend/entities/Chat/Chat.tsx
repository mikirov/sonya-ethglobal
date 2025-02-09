import { Message, MessageType } from "~~/shared/Message";

export const Chat = ({
  messages,
  view,
  toggleView,
}: {
  messages: MessageType[];
  view: string;
  toggleView: () => void;
}) => {
  return (
    <div className="w-full h-full flex flex-col gap-3 py-3 rounded-default overflow-y-auto pr-3">
      {messages.length > 0 ? (
        <>
          <div className="flex justify-center items-end">
            <span
              className="relative mx-auto text-primary z-20"
              onClick={toggleView}
            >
              {view === "voice" ? "hide voice" : "show voice"}
            </span>
          </div>
          {messages.map((message, index) => <Message key={index} {...message} isLast={index === messages.length - 1} />)}
        </>
      ) : view === "text" ? (
        <div className="flex flex-col items-center gap-1 justify-center h-full">
          <h1 className="text-4xl font-bold tracking-tight leading-5 text-base-content">Chat with Sonya</h1>
          <span className="text-base text-base-content/70">Your personal AI psychologist</span>
          <button onClick={toggleView} className="bg-primary rounded-full font-semibold mt-5 text-3xl px-8 py-3">
            Starting talking
          </button>
          <span className="text-sm text-base-content/70">or type your message below</span>
        </div>
      ) : undefined}
    </div>
  );
};
