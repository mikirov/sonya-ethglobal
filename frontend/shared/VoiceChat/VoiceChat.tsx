"use client";

import { useEffect, useState } from "react";
import classNames from "classnames";
import { AnimatePresence, motion } from "motion/react";
import { useAudioRecorder } from "react-audio-voice-recorder";

export const VoiceChat = ({
  input,
  setInput,
  isLoading,
}: {
  input: string;
  setInput: (input: string) => void;
  isLoading: boolean;
}) => {
  const [tapped, setTapped] = useState(false);
  const { startRecording, stopRecording, recordingBlob, isRecording, recordingTime, mediaRecorder } =
    useAudioRecorder();

  const toggleRecording = () => {
    !tapped && setTapped(true);
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  useEffect(() => {
    if (!recordingBlob) return;

    // recordingBlob will be present at this point after 'stopRecording' has been called
    console.log("🚀 ~ useEffect ~ recordingBlob:", recordingBlob);
  }, [recordingBlob]);

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
