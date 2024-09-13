import { Typography } from "antd";
import { SolarDate } from "@nghiavuive/lunar_date_vi";

const { Text } = Typography;

const LunarCalendar = () => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1);

  const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  const renderCalendar = () => {
    return (
      <div className="border border-gray-300 rounded-lg text-md">
        <div className="grid grid-cols-7 bg-card_bg">
          {weekDays.map((day, index) => (
            <div
              key={`day-${index}`}
              className="text-center text-[#143057] font-semibold p-1 border-r border-b border-gray-300 last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {weekDays.map((_, index) => {
            const currentDate = new Date(startOfWeek);
            currentDate.setDate(startOfWeek.getDate() + index);

            const solarDate = new SolarDate(currentDate);
            const lunarDate = solarDate.toLunarDate();

            const isToday = currentDate.toDateString() === today.toDateString();

            return (
              <div
                key={`date-${index}`}
                className={`border-r border-b border-gray-300 last:border-r-0 ${
                  isToday
                    ? "bg-theme_lavender text-white"
                    : "bg-white text-theme_lavender"
                }`}
              >
                <div className="text-center p-2">
                  <div className="font-semibold">{solarDate.day}</div>
                  <Text
                    className={`text-[10px] ${
                      isToday ? "text-white" : "text-theme_lavender"
                    }`}
                  >
                    {lunarDate.day}
                  </Text>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return <div>{renderCalendar()}</div>;
};

export default LunarCalendar;
