import { useEffect, useState } from "react";
import { MdEvent, MdLocationOn } from "react-icons/md";
import { Badge } from "@/components/ui/badge";
import {
  CalendarHeart,
  Clock,
  ClockArrowDown,
  ClockArrowUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export type Event = {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  location: string;
};

interface EventBannerProps {
  evenData: Event[];
}

export default function EventBanner({ evenData }: EventBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // event carousel
  useEffect(() => {
    const timer = setInterval(() => {
      if (evenData.length > 1) {
        setCurrentIndex((prevIndex) =>
          prevIndex === evenData.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [evenData.length]);

  // convert to dd/mm/yyyy
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
      prevIndex === 0 ? evenData.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === evenData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const currentEvent = evenData?.[currentIndex];

  return (
    <div className="relative h-full flex flex-col bg-white p-4 rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 mb-4 text-xl font-bold text-indigo-950">
        <CalendarHeart className="text-primary-text shrink-0" />
        <h1 className="">Sự kiện</h1>
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
              className="text-2xl font-semibold text-indigo-500 absolute w-full cursor-pointer hover:underline"
              title={currentEvent?.name}
              onClick={() => setIsDialogOpen(true)}
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
                icon={<CalendarHeart className="w-5 h-5" />}
                text={formatDate(currentEvent.start_time)}
              />
              {formatTime(currentEvent.start_time) && (
                <ResponsiveBadge
                  icon={<Clock className="w-5 h-5"/>}
                  text={`${formatTime(currentEvent.start_time)} - ${formatTime(
                    currentEvent.end_time
                  )}`}
                />
              )}
            </>
          ) : (
            <>
              <ResponsiveBadge
                icon={<ClockArrowUp className="w-5 h-5"/>}
                text={`${formatDate(currentEvent?.start_time)} ${formatTime(
                  currentEvent?.start_time
                )}`}
              />
              <ResponsiveBadge
                icon={<ClockArrowDown className="w-5 h-5"/>}
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

      {evenData.length > 1 && (
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[98%] rounded-xl sm:rounded-2xl sm:max-w-[70%]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-indigo-500">
              Chi tiết sự kiện
            </DialogTitle>
          </DialogHeader>
          <div className="mt-6 space-y-4">
            {renderField(<MdEvent className="w-5 h-5"/>, "Tên sự kiện", currentEvent?.name || "")}
            {renderField(<CalendarHeart className="w-5 h-5"/>, "Ngày diễn ra", formatDate(currentEvent?.start_time || ""))}
            {renderField(<ClockArrowUp className="w-5 h-5" />, "Thời điểm bắt đầu", `${formatDate(currentEvent?.start_time || "")} ${formatTime(currentEvent?.start_time || "")}`)}
            {renderField(<ClockArrowDown className="w-5 h-5"/>, "Thời điểm kết thúc", `${formatDate(currentEvent?.end_time || "")} ${formatTime(currentEvent?.end_time || "")}`)}
            {currentEvent?.location && renderField(<MdLocationOn className="w-5 h-5"/>, "Địa điểm", currentEvent.location)}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)} className="bg-indigo-500 hover:bg-indigo-500/90 text-xl font-semibold">Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ResponsiveBadgeProps {
  icon: React.ReactNode;
  text: string;
}

const ResponsiveBadge = ({ icon, text }: ResponsiveBadgeProps) => (
  <Badge
    className="bg-crust hover:bg-crust/50 px-2 py-1 max-w-[180px] text-sub-text1 font-semibold"
    title={text}
  >
    <div className="flex items-center gap-1 w-full">
      <div className="shrink-0">{icon}</div>
      <p className="text-sm truncate">{text}</p>
    </div>
  </Badge>
);

const renderField = (icon: React.ReactNode, label: string, value: string) => (
  <div className="flex items-center space-x-2 text-xl text-sub-text1">
    <div className="text-indigo-500">{icon}</div>
    <span className="font-semibold">{label}:</span>
    <span>{value}</span>
  </div>
);
