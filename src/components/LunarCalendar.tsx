import { Typography } from 'antd';
import { SolarDate } from "@nghiavuive/lunar_date_vi";

const { Text } = Typography;

const LunarCalendar = () => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1);

  const weekDays = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];

  const renderCalendar = () => {
    return (
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 bg-[#f2f4f7]">
          {weekDays.map((day, index) => (
            <div
              key={`day-${index}`}
              className="text-center text-[#143057] font-bold p-2 border-r border-b border-gray-300 last:border-r-0"
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
                className={`p-5 border-r border-b border-gray-300 last:border-r-0 ${
                  isToday ? "bg-[#34a6fe] text-white" : "bg-white text-[#34a6fe]"
                }`}
              >
                <div className="text-center">
                  <div className="text-lg font-bold">{solarDate.day}</div>
                  <Text className={`text-sm ${isToday ? "text-white" : "text-[#34a6fe]"}`}>
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

  return <div className="p-4">{renderCalendar()}</div>;
};

export default LunarCalendar;