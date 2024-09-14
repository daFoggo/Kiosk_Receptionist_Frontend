import { useState } from "react";

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

  return (
    <div className="flex flex-col items-center shadow-md w-full h-auto p-4 bg-card rounded-2xl">
      <p className="text-xl font-semibold pb-4 border-b-2 border-gray-300 w-full text-center">
        Quý khách thuộc đối tượng là?
      </p>
      <div
        className={`grid gap-4 mt-12 w-full ${
          options.length === 2 ? "grid-cols-2" : "grid-cols-2 grid-rows-2"
        }`}
      >
        {options.map((option) => (
          <div
            key={option.value}
            onClick={() => handleOptionClick(option.value)}
            className={`cursor-pointer p-4 rounded-lg shadow-md flex items-center justify-center text-center border-2 font-semibold duration-300 ease-in-out ${
              selectedOption === option.value
                ? "bg-theme-lavender text-white"
                : "bg-white text-gray-700 "
            } hover:bg-theme-lavender hover:text-white hover:scale-105`}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectOption;
