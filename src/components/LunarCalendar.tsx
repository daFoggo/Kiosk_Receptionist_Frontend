import { SolarDate } from "@nghiavuive/lunar_date_vi";
import { Button } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { ConfigProvider } from "antd";
import { useState } from "react";

const LunarCalendar = () => {
  const today = new Date();
  const startOfWeek = new Date(today);
  const [showMonthCalendar, setShowMonthCalendar] = useState(false);
  
  startOfWeek.setDate(today.getDate() - today.getDay() + 1);

  const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

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
          className={`flex flex-col items-center gap-2 py-2 ${
            isToday ? "bg-[#e2e6fd]" : ""
          } bg-card rounded-3xl`}
        >
          <div className="text-2xl font-semibold pb-2 border-b-4 border-gray-300">
            {day}
          </div>
          <div
            className={`text-2xl font-bold p-1 ${
              isToday ? "text-white bg-theme-lavender rounded-full" : ""
            }`}
          >
            {currentDate.getDate()}
          </div>
          <div className="text-2xl">{lunarDate.day}</div>
        </div>
      );
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Lịch</h2>
        <div className="flex items-center justify-between">
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  colorPrimary: "#6359e7",
                  algorithm: true, 
                },
              },
            }}
          >
            <Button
              type="default"
              size="large"
              icon={<CalendarOutlined />}
              iconPosition="end"
              className="text-xl font-sans font-semibold"
            >
              Tháng {today.getMonth() + 1}
            </Button>
          </ConfigProvider>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-6">{renderCalendar()}</div>
    </div>
  );
};

export default LunarCalendar;
