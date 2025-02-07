import React, { useState } from "react";
import { streamTextToSpeech } from "./streamTextToSpeech";

const TextToSpeech: React.FC = () => {
  const [text, setText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const handleTTS = async () => {
    try {
      // Stop any currently playing audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      const audio = await streamTextToSpeech(text);

      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.onpause = () => setIsPlaying(false);

      setCurrentAudio(audio);
      audio.play();
    } catch (error) {
      console.error("Error playing TTS:", error);
    }
  };

  return (
    <div>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Enter text to convert to speech" />
      <button onClick={handleTTS} disabled={!text || isPlaying}>
        {isPlaying ? "Playing..." : "Play TTS"}
      </button>
    </div>
  );
};

export default TextToSpeech;
