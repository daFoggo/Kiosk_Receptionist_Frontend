import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const AIChat = ({ message }: { message: string }) => {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [hasSpoken, setHasSpoken] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // voice setup
  useEffect(() => {
    const setVietnameseVoice = () => {
      const synth = window.speechSynthesis;
      const voices = synth.getVoices();
      const vietnameseVoice = voices.find(
        (voice) => voice.lang === "vi-VN" && voice.name.includes("Northern")
      );
      setVoice(
        vietnameseVoice || voices.find((voice) => voice.lang === "vi-VN") || null
      );
    };
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = setVietnameseVoice;
    }
   
    setVietnameseVoice();
  }, []);

  // speak message
  useEffect(() => {
    const speakMessage = (text: string) => {
      if (!voice) return;

      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;

      const audioContext = new (window.AudioContext || window.AudioContext)();
      const source = audioContext.createBufferSource();
      const audioData = new Uint8Array(utterance.text.length);
      utterance.text.split('').forEach((char, index) => {
        audioData[index] = char.charCodeAt(0);
      });
      audioContext.decodeAudioData(audioData.buffer, (buffer) => {
        source.buffer = buffer;
        source.connect(audioContext.destination);
        const audioBlob = new Blob([buffer], { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.muted = true; 
          audioRef.current.play().then(() => {
            audioRef.current!.muted = false; 
          }).catch(error => {
            console.error("Autoplay failed:", error);
          });
        }
      });
    };

    if (voice && !hasSpoken) {
      speakMessage(message);
      setHasSpoken(true);
    }
  }, [message, voice, hasSpoken]);

  return (
    <motion.div
      className="bg-lavender w-full p-4 rounded-3xl shadow-md "
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      key={message}
    >
      <motion.p
        className="font-semibold text-xl text-white text-justify text-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {message}
      </motion.p>
      <audio ref={audioRef} style={{ display: 'none' }} />
    </motion.div>
  );
};

export default AIChat;