"use client";

import { useEffect, useState } from "react";
import classNames from "classnames";
import { AnimatePresence, motion } from "motion/react";
import { useAudioRecorder } from "react-audio-voice-recorder";
import axiosInstance from "~~/utils/axiosInstance";

export const VoiceChat = ({
  input,
  setInput,
  isLoading,
  submit,
}: {
  input: string;
  setInput: (input: string) => void;
  isLoading: boolean;
  submit: () => void;
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
  }, [recordingBlob, isRecording]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="relative cursor-pointer h-full flex justify-center items-center" onClick={toggleRecording}>
        <motion.div
          className={classNames("rounded-full w-32 h-32 bg-accent animate-blob")}
          initial={{ scale: 1 }}
          animate={isRecording ? { scale: 1.3 } : { scale: 1 }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            type: "spring",
            repeat: isRecording ? Infinity : 0,
            repeatType: "reverse",
          }}
        >
          <motion.div
            className={classNames("rounded-full w-32 h-32 bg-accent/30 animate-blob", {})}
            initial={{ scale: 1 }}
            animate={isRecording ? { scale: 1.3 } : { scale: 1 }}
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
