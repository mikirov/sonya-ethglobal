import React, { useState } from "react";
import { Chat } from "~~/entities/Chat";
import { Input } from "~~/shared/Input";
import { MessageRole, MessageType } from "~~/shared/Message";
import { VoiceChat } from "~~/shared/VoiceChat";
import { streamTextToSpeech } from "~~/shared/VoiceChat/streamTextToSpeech";
import axiosInstance from "~~/utils/axiosInstance";

interface SonyaCharacterProps {
  onNewMessage?: () => void;
}

export const SonyaCharacter: React.FC<SonyaCharacterProps> = ({ onNewMessage }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [voiceChat, setVoiceChat] = useState<boolean>(false);
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
      onNewMessage?.();

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

  const handleAudioSend = async (input: string) => {
    stopAudio();

    setIsLoading(true);
    try {
      const sonyaResponse: MessageType = {
        role: MessageRole.Assistant,
        content: input,
      };

      setMessages(prev => [...prev, sonyaResponse]);
      onNewMessage?.();

      const audio = await streamTextToSpeech(input);
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
        {voiceChat && <Chat messages={messages} toggleVoiceChat={() => setVoiceChat(!voiceChat)} />}
        {!voiceChat && (
          <VoiceChat
            setIsLoading={setIsLoading}
            isLoading={isLoading}
            handleSend={handleAudioSend}
            toggleVoiceChat={() => setVoiceChat(!voiceChat)}
          />
        )}
      </div>
      <Input isLoading={isLoading} handleSend={handleSend} />
    </div>
  );
};
