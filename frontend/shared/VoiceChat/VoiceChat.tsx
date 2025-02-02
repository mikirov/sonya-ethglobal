"use client";

import { useEffect } from "react";
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
  const { startRecording, stopRecording, recordingBlob, isRecording, recordingTime, mediaRecorder } =
    useAudioRecorder();

  useEffect(() => {
    if (!recordingBlob) return;

    // recordingBlob will be present at this point after 'stopRecording' has been called
    console.log("🚀 ~ useEffect ~ recordingBlob:", recordingBlob);
  }, [recordingBlob]);

  return (
    <div className="w-full flex flex-col">
      <div className="relative h-full w-full flex justify-center items-center">
        <motion.div
          className={classNames("rounded-full w-32 h-32 bg-black")}
          initial={{ scale: 1 }}
          animate={isRecording ? { scale: 1.3 } : {}}
          transition={isRecording ? { duration: 1, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" } : {}}
        >
          <AnimatePresence>
            {isRecording && (
              <motion.div
                className={classNames("rounded-full w-32 h-32 bg-black/30")}
                initial={{ scale: 1 }}
                animate={{ scale: 1.3 }}
                exit={{ scale: 1 }}
                transition={{ duration: 1, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      <button onClick={startRecording}>Start recording</button>
      <button onClick={stopRecording}>Stop recording</button>
      {recordingTime}
    </div>
  );
};
