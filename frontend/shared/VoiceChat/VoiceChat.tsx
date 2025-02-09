"use client";

import classNames from "classnames";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { useAudioRecorder } from "react-audio-voice-recorder";
import axiosInstance from "~~/utils/axiosInstance";

enum BubbleText {
  TAP_ME = "tap me",
  RECORDING = "recording...",
  LOADING = "loading...",
}

export const VoiceChat = ({
  isLoading,
  setIsLoading,
  handleSend,
}: {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  handleSend: (input: string) => void;
}) => {
  const [bubbleText, setBubbleText] = useState<BubbleText>(BubbleText.TAP_ME);

  const { startRecording, stopRecording, isRecording, recordingBlob } = useAudioRecorder();

  const sendAudioToApi = useCallback(async (blob: Blob) => {
    setIsLoading(true);
    setBubbleText(BubbleText.LOADING);
    try {
      const formData = new FormData();
      const audioFile = new File([blob], "recording.wav", {
        type: blob.type,
      });
      formData.append("file", audioFile);

      const response = await axiosInstance.post("input/speech-to-text", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      });

      handleSend(response.data.response);
    } catch (error) {
      console.error("Error processing audio:", error);
    } finally {
      setIsLoading(false);
      !isRecording && setBubbleText(BubbleText.TAP_ME);
    }
  }, [isRecording, setIsLoading, handleSend]);

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
      sendAudioToApi(recordingBlob as Blob);
    } else {
      setBubbleText(BubbleText.RECORDING);
      startRecording();
    }
  };


  const recordingColor = "#ff6868";
  const speakingColor = "#93bbfb";
  const loadingColor = "#dd93fb";

  return (
    <div className="w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col">
      <div className="relative flex justify-center items-center">
        <motion.div
          className={classNames("rounded-full w-32 h-32 animate-blob cursor-pointer")}
          onClick={toggleRecording}
          initial={{ scale: 1, backgroundColor: speakingColor }}
          animate={
            isLoading
              ? {
                scale: 1.1,
                backgroundColor: loadingColor,
              }
              : isRecording
                ? { scale: 1.3, backgroundColor: recordingColor }
                : { scale: 1, backgroundColor: speakingColor }
          }
          transition={{
            duration: 3,
            ease: "easeInOut",
            type: "spring",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <motion.div
            className={classNames("rounded-full w-32 h-32 opacity-30 animate-blob")}
            initial={{ scale: 1, backgroundColor: speakingColor }}
            animate={
              isLoading
                ? {
                  scale: 1.1,
                  backgroundColor: loadingColor,
                }
                : isRecording
                  ? { scale: 1.3, backgroundColor: recordingColor }
                  : { scale: 1, backgroundColor: speakingColor }
            }
            transition={{
              duration: 1,
              ease: "easeInOut",
              repeat: isRecording ? Infinity : 0,
              repeatType: "reverse",
            }}
          />
        </motion.div>
        <AnimatePresence>
          <motion.span
            className="absolute text-xs text-accent-content/40"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {bubbleText}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};
