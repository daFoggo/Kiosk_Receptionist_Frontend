// Libraries
import { motion } from "framer-motion";
import "./style.css";

// Components and Icons
import { ScanLine } from "lucide-react";
import { Button } from "../ui/button";

// Interfaces and utils
import { IGuestInteraction } from "@/models/GuestInteraction/GuestInteraction";

const GuestInteraction = ({
  handleVerificationStart,
  handleScanQRStart,
}: IGuestInteraction) => {
  return (
    <div className="flex flex-col items-center gap-6 px-24 w-full">
      <motion.div
        className="container-btn w-full"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          className="bg-indigo-500 font-semibold hover:bg-indigo-500/90 py-6 text-xl border shadow-sm rounded-xl flex items-center justify-between gap-2 w-full"
          onClick={handleVerificationStart}
        >
          <p>Xác thực thông tin khách</p>
          <ScanLine className="font-semibold w-6 h-6" />
        </Button>
      </motion.div>

      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          className="bg-indigo-500 font-semibold hover:bg-indigo-500/90 py-6 text-xl border shadow-sm rounded-xl flex items-center justify-between gap-2 w-full"
          onClick={handleScanQRStart}
        >
          <p>Tôi có lịch hẹn</p>
          <ScanLine className="font-semibold w-6 h-6" />
        </Button>
      </motion.div>
    </div>
  );
};

export default GuestInteraction;
