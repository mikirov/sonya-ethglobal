import axiosInstance from "~~/utils/axiosInstance";

export async function streamTextToSpeech(text: string, type: "mp3" | "wav" = "mp3") {
  try {
    const response = await axiosInstance.post(
      "input/tts-chatgpt-stream",
      { text, type },
      { responseType: "blob" }, // Add this to handle binary data
    );

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Create a new Audio element
    const audio = new Audio();

    // The response.data is already a blob when responseType is 'blob'
    const url = URL.createObjectURL(response.data);
    audio.src = url;

    // Clean up the object URL when we're done with it
    audio.onended = () => URL.revokeObjectURL(url);

    // Play the audio
    await audio.play();

    return audio;
  } catch (error) {
    console.error("Error streaming TTS:", error);
    throw error;
  }
}
