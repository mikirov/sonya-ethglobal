import React, { useState } from "react";
import { Chat } from "~~/entities/Chat";
import { Input } from "~~/shared/Input";
import { MessageRole, MessageType } from "~~/shared/Message";
import { VoiceChat } from "~~/shared/VoiceChat";
import { streamTextToSpeech } from "~~/shared/VoiceChat/streamTextToSpeech";
import axiosInstance from "~~/utils/axiosInstance";

export const SonyaCharacter: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<"text" | "voice">("text");
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleSend = async (input: string) => {
    stopAudio();

    setMessages([...messages, { role: MessageRole.User, content: input }]);
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
        audio.play();
      }
    } catch (error) {
      console.error("Error sending input:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-164px)] md:h-[calc(100vh-124px)] container px-8 py-3 mx-auto flex flex-col gap-5">
      <div className="relative h-full overflow-hidden">
        <Chat messages={messages} view={view} toggleView={() => setView(view === "text" ? "voice" : "text")} />
        {view === "voice" ? (
            <VoiceChat setIsLoading={setIsLoading} isLoading={isLoading} handleSend={handleSend} />
        ) : undefined}
      </div>
      <Input isLoading={isLoading} handleSend={handleSend} />
    </div>
  );
};
