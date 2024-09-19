import { motion } from "framer-motion";
import { useState, useEffect} from "react";

const AIChat = ({ message }: { message: string }) => {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

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

  // useEffect(() => {
  //   if (voice && !isSpeaking) {
  //     setIsSpeaking(true);
  //     const utterance = new SpeechSynthesisUtterance(message);
  //     utterance.voice = voice;
  //     utterance.onend = () => setIsSpeaking(false);
  //     window.speechSynthesis.speak(utterance);
  //   }

  //   return () => {
  //     window.speechSynthesis.cancel(); 
  //   };
  // }, [message, voice, isSpeaking]);

  return (
    <motion.div
      className="bg-lavender w-full p-4 rounded-3xl shadow-md"
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
    </motion.div>
  );
};

export default AIChat;