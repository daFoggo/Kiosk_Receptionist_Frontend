"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { ISelectOptionProps } from "@/models/SelectOption/SelectOption";

const SelectOption = ({ select, onOptionSelect }: ISelectOptionProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleConfirm = () => {
    if (selectedOption) {
      onOptionSelect(selectedOption);
    }
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
    <div className="flex flex-col items-center w-full mx-auto space-y-6">
      <motion.div
        key={select?.question}
        className=" w-full p-4 bg-white rounded-2xl border shadow-sm"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-xl font-semibold text-primary-text text-center">
          {select?.question}
        </p>
      </motion.div>

      <motion.div
        className="w-full space-y-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {select.options &&
          select?.options.map((option) => (
            <motion.div
              key={option.value}
              className={`p-3 rounded-lg cursor-pointer transition-colors font-semibold shadow-sm border  ${
                selectedOption === option.value
                  ? "bg-indigo-500 text-white"
                  : "bg-crust text-primary-text hover:bg-surface0"
              }`}
              onClick={() => setSelectedOption(option.value)}
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              {option.label}
            </motion.div>
          ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          disabled={!selectedOption}
          onClick={() => handleConfirm()}
          className="bg-indigo-500 text-white py-6 px-8 text-xl border shadow-sm rounded-xl font-semibold cursor-pointer hover:bg-indigo-500/90"
        >
          Xác nhận
        </Button>
      </motion.div>
    </div>
  );
};

export default SelectOption;
