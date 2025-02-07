import React, { FormEvent, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Chat } from "~~/entities/Chat";
import { Input } from "~~/shared/Input";
import { MessageRole, MessageType } from "~~/shared/Message";
import { VoiceChat } from "~~/shared/VoiceChat";
import { streamTextToSpeech } from "~~/shared/VoiceChat/streamTextToSpeech";
import axiosInstance from "~~/utils/axiosInstance";

interface SonyaCharacterProps {
  walletAddress?: string;
}

export const SonyaCharacter: React.FC<SonyaCharacterProps> = ({ walletAddress }) => {
  const { login, authenticated } = usePrivy();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [view, setView] = useState<"text" | "voice">("text");
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSpeaking(false);
    }
  };

  const handleSend = async () => {
    stopAudio();

    setMessages([...messages, { role: MessageRole.User, content: input }]);
    setInput("");
    setIsLoading(true);
    try {
      const apiResponse = await axiosInstance.post(`input/text`, {
        input,
      });

      const sonyaResponse: MessageType = {
        role: MessageRole.Assistant,
        content: apiResponse.data.response,
      };

      setMessages(prev => [...prev, sonyaResponse]);

      const audio = await streamTextToSpeech(apiResponse.data.response);
      if (audio) {
        audio.onplay = () => setIsSpeaking(true);
        audio.onended = () => setIsSpeaking(false);
        audio.onpause = () => setIsSpeaking(false);
        audio.play();
      }
    } catch (error) {
      console.error("Error sending input:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await handleSend();
  };

  return (
    <div className="h-[calc(100vh-164px)] md:h-[calc(100vh-124px)] container px-8 py-3 mx-auto flex flex-col gap-5">
      {view === "text" ? (
        <div className="overflow-hidden h-full">
          <Chat messages={messages} toggleToVoice={() => setView("voice")} />
        </div>
      ) : (
        <div className="overflow-hidden h-full">
          <button onClick={() => setView("text")}>Back to text</button>
          <VoiceChat setIsLoading={setIsLoading} isLoading={isLoading} />
        </div>
      )}
      <form className="w-full" onSubmit={onSubmit}>
        <Input input={input} setInput={setInput} isLoading={isLoading} />
      </form>
    </div>
  );
};
