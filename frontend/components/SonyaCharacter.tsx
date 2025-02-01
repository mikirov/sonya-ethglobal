import React, { FormEvent, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Chat } from "~~/Chat";
import { Input } from "~~/entities/Input";
import { MessageRole, MessageType } from "~~/shared/Message";
import axiosInstance from "~~/utils/axiosInstance";

interface SonyaCharacterProps {
  walletAddress?: string;
}

export const SonyaCharacter: React.FC<SonyaCharacterProps> = ({ walletAddress }) => {
  const { login, authenticated } = usePrivy();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessages([...messages, { role: MessageRole.User, content: input }]);
    setInput("");

    try {
      const apiResponse = await axiosInstance.post(`input/process-input`, {
        input,
        walletAddress,
      });

      const sonyaResponse: MessageType = {
        role: MessageRole.Assistant,
        content: apiResponse.data.response,
      };

      setMessages(prev => [...prev, sonyaResponse]);

      if (apiResponse.data.audio) {
        const audioElement = new Audio(apiResponse.data.audio);
        audioElement.play();
      }
    } catch (error) {
      console.error("Error sending input:", error);
    }
  };

  return (
    <div className="container px-4 py-16 mx-auto max-w-7xl flex flex-col h-full">
      <div className="flex flex-col bg-foreground h-full items-center justify-end rounded-default overflow-hidden">
        <Chat messages={messages} />
        <form className="w-full" onSubmit={onSubmit}>
          <Input input={input} setInput={setInput} />
        </form>
      </div>
    </div>
  );
};
