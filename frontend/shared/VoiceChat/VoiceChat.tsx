"use client";

import { useEffect, useState } from "react";
import classNames from "classnames";
import { AnimatePresence, motion } from "motion/react";
import { useAudioRecorder } from "react-audio-voice-recorder";
import axiosInstance from "~~/utils/axiosInstance";

export const VoiceChat = ({
  isLoading,
  setIsLoading,
}: {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}) => {
  const [tapped, setTapped] = useState(false);

  const { startRecording, stopRecording, isRecording, recordingTime, recordingBlob } = useAudioRecorder();

  const toggleRecording = () => {
    !tapped && setTapped(true);
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  useEffect(() => {
    const sendAudioToApi = async (blob: Blob) => {
      setIsLoading(true);
      try {
        const formData = new FormData();
        const audioFile = new File([blob], "recording.wav", {
          type: blob.type,
        });
        formData.append("file", audioFile);

        const response = await axiosInstance.post("input/speech-to-speech-stream", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        });
        setIsLoading(false);

        const audio = new Audio();
        const url = URL.createObjectURL(response.data);
        audio.src = url;
        audio.onended = () => URL.revokeObjectURL(url);
        await audio.play();
      } catch (error) {
        console.error("Error processing audio:", error);
      }
    };

    if (recordingBlob && !isRecording) {
      sendAudioToApi(recordingBlob);
    }
  }, [recordingBlob, isRecording, setIsLoading]);

  const recordingColor = "#ff6868";
  const speakingColor = "#93bbfb";
  const loadingColor = "#dd93fb";

  return (
    <div className="w-full h-full flex flex-col">
      <div className="relative cursor-pointer h-full flex justify-center items-center" onClick={toggleRecording}>
        <motion.div
          className={classNames("rounded-full w-32 h-32 animate-blob", speakingColor)}
          initial={{ rotate: 0, scale: 1 }}
          animate={
            isLoading
              ? {
                  rotate: 180,
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
            className={classNames("rounded-full w-32 h-32 opacity-30 animate-blob", speakingColor)}
            initial={{ scale: 1 }}
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
          {!tapped && (
            <motion.span
              className="absolute text-xs text-accent-content/40"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              tap me
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      {recordingTime}
    </div>
  );
};
