import { useEffect, useState } from "react";
import { MdEvent } from "react-icons/md";
import { MdDateRange, MdOutlineAccessTime, MdLocationOn } from "react-icons/md";


const EventBanner = () => {
  const [event, setEvent] = useState({
    title: "Lễ kỉ niệm 78 năm ngày thành lập Viện Khoa học Kỹ thuật Bưu điện",
    date: "17/8/2024",
    time: "Thời gian diễn ra",
    location: "Tầng 5",
  });

  useEffect(() => {
    getEventData();
  }, []);

  const getEventData = async () => {};

  return (
    <div className="w-full bg-base p-4 rounded-3xl">
      <div className="flex items-center gap-2 mb-4 text-2xl font-semibold">
        <MdEvent className="text-primary-text" />
        <h1 className="text-heading">Sự kiện hôm nay</h1>
      </div>
      <h1 className="text-3xl font-semibold text-lavender mb-2">
        {event?.title}
      </h1>
      <div className="flex items-center gap-2 text-sub-text1 font-semibold">
        {event?.date && (
          <div className="flex items-center gap-2 text-lg bg-crust w-fit px-2 py-1 rounded-full">
            <MdDateRange />
            <p>{event?.date}</p>
          </div>
        )}
        {event?.time && (
          <div className="flex items-center gap-2 text-lg bg-crust w-fit px-2 py-1 rounded-full">
            <MdOutlineAccessTime />
            <p>{event?.time}</p>
          </div>
        )}
        {
          event?.location && (
            <div className="flex items-center gap-2 text-lg bg-crust w-fit px-2 py-1 rounded-full">
              <MdLocationOn />
              <p>{event?.location}</p>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default EventBanner;
