import React from 'react';
import { motion } from "framer-motion";

const AIChat = ({ message }: { message: string }) => {
  return (
    <motion.div 
      className="bg-theme-lavender w-full px-4 py-8 rounded-3xl shadow-md"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
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