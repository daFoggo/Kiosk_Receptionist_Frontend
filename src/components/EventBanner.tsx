import { useEffect, useState } from "react";
import { MdEvent, MdLocationOn } from "react-icons/md";
import { Badge } from "./ui/badge";
import { ipGetEvents } from "@/utils/ip";
import axiosInstance from "@/utils/axiosInstance";
import {
  CalendarHeart,
  Clock,
  ClockArrowDown,
  ClockArrowUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Event = {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  location: string;
};

const EventBanner = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    getEventData();
  }, []);

  // event carousel
  useEffect(() => {
    const timer = setInterval(() => {
      if (events.length > 1) {
        setCurrentIndex((prevIndex) =>
          prevIndex === events.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [events.length]);

  const getEventData = async () => {
    try {
      const response = await axiosInstance.get(ipGetEvents);
      const sortedEvents = response.data.sort(
        (a: { start_time: string }, b: { start_time: string }) =>
          new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
      );
      const currentWeekEvents = filterEventsInWeek(sortedEvents);
      setEvents(currentWeekEvents);
    } catch (error) {
      console.error("Error getting event data:", error);
    }
  };
  
  const filterEventsInWeek = (events: Event[]) => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(now.getDate() + (6 - now.getDay())));
    const filteredEvents = events.filter((event) => {
      const eventDate = new Date(event.start_time);
      return eventDate >= startOfWeek && eventDate <= endOfWeek;
    });
    return filteredEvents.length > 0 ? filteredEvents : [events[0]];
  };

  // conver to dd/mm/yyyy
  const formatDate = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // convert to hh:mm. if 00:00 return empty string
  const formatTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    if (hours === 0 && minutes === 0) {
      return "";
    }

    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // check if 2 dates are the same
  const areDatesSame = (startDate: string, endDate: string) => {
    const start = new Date(startDate).toLocaleDateString("vi-VN");
    const end = new Date(endDate).toLocaleDateString("vi-VN");
    return start === end;
  };

  // carousel action
  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? events.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === events.length - 1 ? 0 : prevIndex + 1
    );
  };


  const currentEvent = events?.[currentIndex];

  return (
    <div className="relative h-full flex flex-col bg-white p-4 rounded-2xl border shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 mb-4 text-xl font-bold">
        <MdEvent className="text-primary-text shrink-0" />
        <h1 className="text-heading">Sự kiện</h1>
      </div>

      <div className="flex-grow flex flex-col px-4">
        <div className="h-[2.5rem] relative">
          <AnimatePresence mode="wait">
            <motion.h1
              key={currentEvent?.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-semibold text-lavender truncate absolute w-full"
              title={currentEvent?.name}
            >
              {currentEvent?.name}
            </motion.h1>
          </AnimatePresence>
        </div>

        <div className="flex-grow"></div>

        <div className="flex flex-wrap items-center gap-2">
          {currentEvent &&
          areDatesSame(currentEvent.start_time, currentEvent.end_time) ? (
            <>
              <ResponsiveBadge
                icon={<CalendarHeart />}
                text={formatDate(currentEvent.start_time)}
              />
              {formatTime(currentEvent.start_time) && (
                <ResponsiveBadge
                  icon={<Clock />}
                  text={`${formatTime(currentEvent.start_time)} - ${formatTime(
                    currentEvent.end_time
                  )}`}
                />
              )}
            </>
          ) : (
            <>
              <ResponsiveBadge
                icon={<ClockArrowUp />}
                text={`${formatDate(currentEvent?.start_time)} ${formatTime(
                  currentEvent?.start_time
                )}`}
              />
              <ResponsiveBadge
                icon={<ClockArrowDown />}
                text={`${formatDate(currentEvent?.end_time)} ${formatTime(
                  currentEvent?.end_time
                )}`}
              />
            </>
          )}
          {currentEvent?.location && (
            <ResponsiveBadge
              icon={<MdLocationOn />}
              text={currentEvent.location}
            />
          )}
        </div>
      </div>

      {events.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-2 top-[45%] -translate-y-1/2 rounded-full bg-crust/50 hover:bg-crust transition-colors"
          >
            <ChevronLeft className="text-sub-text1 w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-[45%] -translate-y-1/2 rounded-full bg-crust/50 hover:bg-crust transition-colors"
          >
            <ChevronRight className="text-sub-text1 w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
};

interface ResponsiveBadgeProps {
  icon: React.ReactNode;
  text: string;
}

const ResponsiveBadge = ({ icon, text }: ResponsiveBadgeProps) => (
  <Badge
    className="bg-crust hover:bg-crust/50 px-2 py-1 max-w-[180px] text-sub-text1"
    title={text}
  >
    <div className="flex items-center gap-1 w-full">
      <div className="shrink-0">{icon}</div>
      <p className="text-sm font-medium truncate">{text}</p>
    </div>
  </Badge>
);

export default EventBanner;
