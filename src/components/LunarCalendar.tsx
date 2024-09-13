import { Typography } from "antd";
import { SolarDate } from "@nghiavuive/lunar_date_vi";

const { Text } = Typography;

const LunarCalendar = () => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1);

  const weekDays = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"];

  const renderCalendar = () => {
    return (
      <div className="border border-gray-300 rounded-3xl text-2xl">
        <div className="grid grid-cols-7 bg-card_bg rounded-t-3xl">
          {weekDays.map((day, index) => (
            <div
              key={`day-${index}`}
              className="text-3xl text-center text-[#143057] font-semibold p-5 border-r border-b border-gray-300 last:border-r-0"
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
                className={`border-r  border-gray-300 last:border-r-0 ${
                  isToday
                    ? "bg-theme_lavender text-white"
                    : " text-theme_lavender"
                }`}
              >
                <div className="text-center p-5">
                  <div className="font-semibold text-3xl">{solarDate.day}</div>
                  <Text
                    className={`text-xl ${
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

  return <div className="h-full">{renderCalendar()}</div>;
};

export default LunarCalendar;