import { Message, MessageType } from "~~/shared/Message";

export const Chat = ({ messages }: { messages: MessageType[] }) => {
  return (
    <div className="w-full h-full flex flex-col gap-2 rounded-default overflow-hidden overflow-y-auto p-5">
      {messages.length > 0 ? (
        messages.map((message, index) => <Message key={index} {...message} isLast={index === messages.length - 1} />)
      ) : (
        <div className="flex flex-col items-center gap-1 justify-center h-full">
          <h1 className="text-4xl font-bold tracking-tight text-base-content">Chat with Sonya</h1>
          <span className="text-base text-base-content/70">Your personal AI psychologist</span>
        </div>
      )}
    </div>
  );
};
