import React, { useState } from "react";
import { motion } from "framer-motion";

interface Option {
  label: string;
  value: string;
}

const SelectOption = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const options: Option[] = [
    { label: "Sinh viên", value: "sinhVien" },
    { label: "Khách mời sự kiện", value: "khachMoi" },
    { label: "Cán bộ viện", value: "canBo" },
    { label: "Khác", value: "khac" },
  ];

  const handleOptionClick = (value: string) => {
    setSelectedOption(value);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto space-y-6">
      <motion.div
        className="shadow-md w-full p-4 bg-white rounded-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-xl font-semibold text-heading text-center">
          Quý khách thuộc đối tượng là?
        </p>
      </motion.div>

      <motion.div
        className="w-full space-y-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {options.map((option) => (
          <motion.div
            key={option.value}
            className={`p-3 rounded-lg cursor-pointer transition-colors shadow-sm ${
              selectedOption === option.value
                ? "bg-theme-lavender text-white"
                : "bg-white text-heading hover:bg-gray-100"
            }`}
            onClick={() => handleOptionClick(option.value)}
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            {option.label}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SelectOption;
