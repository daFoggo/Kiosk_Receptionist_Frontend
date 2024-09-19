import { SolarDate } from "@nghiavuive/lunar_date_vi";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const LunarCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const today = new Date();
  const [startOfWeek, setStartOfWeek] = useState(new Date());

  useEffect(() => {
    const updatedStartOfWeek = new Date(date);
    updatedStartOfWeek.setDate(date?.getDate() - date?.getDay() + 1);
    setStartOfWeek(updatedStartOfWeek);
  }, [date]);

  const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  const handleSelectDate = (selectedDate: Date | undefined) => {
    const today = new Date();

    if (selectedDate?.toDateString() === date?.toDateString()) {
      setDate(today);
    } else {
      setDate(selectedDate || today);
    }
  };

  const renderCalendar = () => {
    return weekDays.map((day, index) => {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + index);

      const solarDate = new SolarDate(currentDate);
      const lunarDate = solarDate.toLunarDate();

      const isToday = currentDate.toDateString() === today.toDateString();

      return (
        <div
          key={index}
          className={`flex flex-col items-center gap-2 py-2 font-sans ${
            isToday ? "bg-[#e2e6fd]" : ""
          } bg-base rounded-3xl`}
        >
          <div className="text-2xl font-semibold pb-2 border-b-4 border-gray-300">
            {day}
          </div>
          <div
            className={`text-2xl font-bold p-1 ${
              isToday ? "text-white bg-lavender rounded-full" : ""
            }`}
          >
            {currentDate.getDate()}
          </div>
          <div className="text-xs font-semibold text-overlay">
            {lunarDate.day} AL
          </div>
        </div>
      );
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md font-sans">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-heading">Lịch</h2>
        <div className="flex items-center justify-between">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-fit justify-start text-left font-sans font-semibold",
                  !date && "text-muted-foreground",
                )
              }
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date &&
                  format(date, "MMMM", { locale: vi }).charAt(0).toUpperCase() +
                    format(date, "MMMM", { locale: vi }).slice(1)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleSelectDate}
                initialFocus
                className="text-3xl"
                locale={vi}
                classNames={{
                  day_selected: "bg-lavender text-white",
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-6">{renderCalendar()}</div>
    </div>
  );
};

export default LunarCalendar;
