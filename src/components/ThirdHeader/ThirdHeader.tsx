import { BotMessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const ThirdHeader = ({
  title,
  subText,
}: {
  title: string;
  subText: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="absolute top-0 left-0 right-0 z-0"
    >
      <header className="px-6 py-3 flex gap-2 items-center font-clash text-2xl relative z-10">
        <div className="bg-base p-2 rounded-lg w-max h-max">
          <BotMessageSquare />
        </div>
        <div className="flex flex-col text-left">
          <h1>{title}</h1>
          <p className="text-xs font-sans font-semibold">{subText}</p>
        </div>
      </header>
    </motion.div>
  );
};

export default ThirdHeader;
