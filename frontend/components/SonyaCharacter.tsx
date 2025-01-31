import React, { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import axiosInstance from "~~/utils/axiosInstance";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface SonyaCharacterProps {
  walletAddress?: string;
}

export const SonyaCharacter: React.FC<SonyaCharacterProps> = ({ walletAddress }) => {
  const { login, authenticated } = usePrivy();
  const [userInput, setUserInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendInput = async () => {
    if (!userInput.trim()) return;

    const newMessage: Message = {
      role: "user",
      content: userInput.trim(),
    };

    setMessages(prev => [...prev, newMessage]);
    setUserInput("");
    setIsLoading(true);

    try {
      const apiResponse = await axiosInstance.post(`input/process-input`, {
        input: userInput,
        walletAddress,
      });

      const sonyaResponse: Message = {
        role: "assistant",
        content: apiResponse.data.response,
      };

      setMessages(prev => [...prev, sonyaResponse]);

      if (apiResponse.data.audio) {
        const audioElement = new Audio(apiResponse.data.audio);
        audioElement.play();
      }
    } catch (error) {
      console.error("Error sending input:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendInput();
    }
  };

  return (
    <div className="container flex flex-col h-[calc(95vh-4rem)] px-4 mx-auto max-w-5xl">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-base-content">Chat with Sonya AI</h1>
        <p className="text-base text-base-content/70">Your personal AI assistant</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="pb-4 space-y-6">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user" ? "bg-primary text-primary-content" : "bg-base-200 text-base-content"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-base-200">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-base-content/60 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-base-content/60 animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-base-content/60 animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-row w-full mb-10 bg-base-100 rounded-3xl">
        <textarea
          className="w-full pr-24 border-none outline-none resize-none textarea focus:textarea-primary focus:outline-none ring-0 focus:ring-0 focus:border-none !border-none !outline-none !ring-0"
          placeholder="Message Sonya..."
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          rows={1}
        />
        <button
          onClick={handleSendInput}
          disabled={!userInput.trim() || isLoading}
          className="w-24 h-5 btn btn-primary"
        >
          Send
        </button>
      </div>
    </div>
  );
};
