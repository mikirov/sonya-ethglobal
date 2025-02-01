import React, { FormEvent, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Chat } from "~~/entities/Chat";
import { Input } from "~~/shared/Input";
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
    <div className="container px-8 py-3 pb-16 mx-auto flex flex-col gap-5 h-full">
      <div className="overflow-hidden h-full">
        <Chat messages={messages} />
      </div>
      <form className="w-full" onSubmit={onSubmit}>
        <Input input={input} setInput={setInput} />
      </form>
    </div>
  );
};
