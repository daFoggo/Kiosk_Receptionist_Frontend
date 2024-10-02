import { useEffect, useState } from "react";
import { MdEvent } from "react-icons/md";
import { MdLocationOn } from "react-icons/md";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { ipGetEvents } from "@/utils/ip";
import axios from "axios";
import { tempToken } from "@/utils/ip";
import { CalendarHeart, Clock, ClockArrowDown, ClockArrowUp } from "lucide-react";

type Event = {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  location: string;
};

const EventBanner = () => {
  const [event, setEvent] = useState<Event>({
    id: 0,
    name: "",
    start_time: "",
    end_time: "",
    location: "",
  });

  useEffect(() => {
    getEventData();
  }, []);

  const getEventData = async () => {
    try {
      const response = await axios.get(ipGetEvents, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const sortedEvents = response.data.sort(
        (a: { start_time: string }, b: { start_time: string }) =>
          new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
      );

      setEvent(sortedEvents[0]);
    } catch (error) {
      toast.error("Tải sự kiện thất bại");
      console.error("Error getting event data:", error);
    }
  };

  const formatDate = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // kiem tra neu ngay cua ca 2 co giong nhau khong
  const areDatesSame = (startDate: any, endDate: any) => {
    const start = new Date(startDate).toLocaleDateString("vi-VN");
    const end = new Date(endDate).toLocaleDateString("vi-VN");
    return start === end;
  };

  return (
    <div className="h-full flex flex-col bg-base p-4 rounded-2xl border shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-xl font-bold">
        <MdEvent className="text-primary-text" />
        <h1 className="text-heading">Sự kiện</h1>
      </div>
      <h1 className="text-2xl font-semibold text-lavender mb-4">
        {event?.name}
      </h1>
      <div className="flex-grow"></div>
      <div className="flex items-center gap-2">
        {areDatesSame(event?.start_time, event?.end_time) ? (
          <>
            <Badge className="bg-crust text-lg text-sub-text1 font-semibold gap-2 hover:bg-crust/50">
              <CalendarHeart className="text-center" />
              <p>{formatDate(event?.start_time)}</p>
            </Badge>

            <Badge className="bg-crust text-lg text-sub-text1 font-semibold gap-2 hover:bg-crust/50">
              <Clock className="text-center" />
              <p>
                {formatTime(event?.start_time)} - {formatTime(event?.end_time)}
              </p>
            </Badge>
          </>
        ) : (
          <>
            <Badge className="bg-crust text-lg text-sub-text1 font-semibold gap-2 hover:bg-crust/50">
              <ClockArrowUp className="text-center" />
              <p>
                {formatDate(event?.start_time)} {formatTime(event?.start_time)}
              </p>
            </Badge>

            <Badge className="bg-crust text-lg text-sub-text1 font-semibold gap-2 hover:bg-crust/50">
              <ClockArrowDown className="text-center" />
              <p>
                {formatDate(event?.end_time)} {formatTime(event?.end_time)}
              </p>
            </Badge>
          </>
        )}
        {event?.location && (
          <Badge className="bg-crust text-lg text-sub-text1 font-semibold gap-2 hover:bg-crust/50">
            <MdLocationOn className="text-center" />
            <p>{event?.location}</p>
          </Badge>
        )}
      </div>
    </div>
  );
};

export default EventBanner;
