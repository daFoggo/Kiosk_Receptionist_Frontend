import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "antd";
import { ConfigProvider } from "antd";
import { SelectOptionProps } from "../types/ChatMockData";

const SelectOption = ({
  select,
  onOptionSelect,
  setIsScanning,
}: {
  select: SelectOptionProps;
  onOptionSelect: (value: string) => void;
  setIsScanning: (value: boolean) => void;
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    setSelectedOption(null);
  }, [select]);

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
    <div className="flex flex-col items-center w-full mx-auto space-y-6">
      <motion.div
        key={select?.question}
        className="shadow-md w-full p-4 bg-white rounded-2xl"
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
              className={`p-3 rounded-lg cursor-pointer transition-colors font-semibold shadow-sm ${
                selectedOption === option.value
                  ? "bg-lavender text-white"
                  : "bg-base text-primary-text hover:bg-surface0"
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

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ConfigProvider
          theme={{
            components: {
              Button: {
                colorPrimary: "#7287fd",
                algorithm: true,
                fontFamily: "Inter",
                fontWeight: "bold",
              },
            },
          }}
        >
          <Button
            type="primary"
            className="text"
            size="large"
            disabled={!selectedOption}
            onClick={() => {
              onOptionSelect(selectedOption as string);
              if (selectedOption === "khach") {
                setIsScanning(true);
              }
            }}
          >
            Xác nhận
          </Button>
        </ConfigProvider>
      </motion.div>
    </div>
  );
};

export default SelectOption;
