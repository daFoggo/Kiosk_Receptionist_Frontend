import { useEffect, useState } from "react";
import { MdEvent } from "react-icons/md";
import { MdDateRange, MdOutlineAccessTime, MdLocationOn } from "react-icons/md";
import { Badge } from "./ui/badge";

const EventBanner = () => {
  const [event, setEvent] = useState({
    title: "Lễ kỉ niệm 58 năm ngày thành lập Viện Khoa học Kỹ thuật Bưu điện",
    date: "17/9/2024",
    time: "",
    location: "Hội trường 2 - Tầng 2",
  });

  useEffect(() => {
    getEventData();
  }, []);

  const getEventData = async () => {};

  return (
    <div className="w-full bg-base p-4 rounded-3xl shadow-md shad">
      <div className="flex items-center gap-2 mb-4 text-2xl font-semibold">
        <MdEvent className="text-primary-text" />
        <h1 className="text-heading">Sự kiện</h1>
      </div>
      <h1 className="text-3xl font-semibold text-lavender mb-2">
        {event?.title}
      </h1>
      <div className="flex items-center gap-2">
        {event?.date && (
          <Badge className="bg-crust text-lg text-sub-text1 font-semibold gap-2">
            <MdDateRange className="text-center" />
            <p> {event?.date}</p>
          </Badge>
        )}
        {event?.time && (
          <Badge className="bg-crust text-lg text-sub-text1 font-semibold gap-2">
            <MdOutlineAccessTime className="text-center" />
            <p> {event?.time}</p>
          </Badge>
        )}
        {event?.location && (
          <Badge className="bg-crust text-lg text-sub-text1 font-semibold gap-2">
            <MdLocationOn className="text-center" />
            <p> {event?.location}</p>
          </Badge>
        )}
      </div>
    </div>
  );
};

export default EventBanner;
