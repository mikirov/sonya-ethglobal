import { Message, MessageType } from "~~/shared/Message";

export const Chat = ({ messages, toggleToVoice }: { messages: MessageType[]; toggleToVoice: () => void }) => {
  return (
    <div className="w-full h-full flex flex-col gap-3 py-3 rounded-default overflow-y-auto pr-3">
      {messages.length > 0 ? (
        messages.map((message, index) => <Message key={index} {...message} isLast={index === messages.length - 1} />)
      ) : (
        <div className="flex flex-col items-center gap-1 justify-center h-full">
          <h1 className="text-4xl font-bold tracking-tight leading-5 text-base-content">Chat with Sonya</h1>
          <span className="text-base text-base-content/70">Your personal AI psychologist</span>
          <button onClick={toggleToVoice} className="bg-primary rounded-full font-semibold mt-5 text-3xl px-8 py-3">
            Starting talking
          </button>
          <span className="text-sm text-base-content/70">or type your message below</span>
        </div>
      )}
    </div>
  );
};
