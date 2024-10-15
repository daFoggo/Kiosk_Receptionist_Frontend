import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { VolumeX, Volume2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface AIChatProps {
  message: string;
}

const AIChat: React.FC<AIChatProps> = ({ message }) => {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Voice setup
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

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Speech synthesis
  const speak = useCallback(() => {
    if (!voice || !message) return;

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.voice = voice;
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    window.speechSynthesis.speak(utterance);
  }, [voice, message]);

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Trigger speech when message changes
  useEffect(() => {
    if (message) {
      speak();
    }
  }, [message, speak]);

  if (!message) return null;

  return (
    <motion.div
      className="bg-indigo-500 w-full p-4 rounded-2xl border shadow-sm relative"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      key={message}
    >
      <motion.p
        className="font-semibold text-xl text-white text-justify text-wrap pr-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {message}
      </motion.p>
      <Button
        className="absolute top-2 right-2 bg-transparent hover:bg-white/20"
        onClick={isSpeaking ? stopSpeaking : speak}
      >
        {isSpeaking ? <VolumeX className="h-6 w-6 text-white" /> : <Volume2 className="h-6 w-6 text-white" />}
      </Button>
    </motion.div>
  );
};

export default AIChat;