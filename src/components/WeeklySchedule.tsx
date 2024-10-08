import React, { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Calendar as CalendarIcon,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

interface Work {
  name: string;
  attendees: string;
  preparation?: string;
  location: string;
  iso_datetime: Date;
}

interface WeeklyScheduleProps {
  works: Work[];
}

const generateHours = () => {
  return Array.from({ length: 14 }, (_, i) => {
    const hour = i + 7 < 10 ? `0${i + 7}` : `${i + 7}`;
    return `${hour}:00`;
  });
};

const WeeklySchedule = ({ works }: WeeklyScheduleProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hours = generateHours();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 2 * 60); // Scroll to 9:00 AM
    }
  }, []);

  const getWeekDates = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
    const monday = new Date(date.setDate(diff));
    const sunday = new Date(date.setDate(diff + 6));
    return { monday, sunday };
  };

  const navigateCalendar = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    const { monday, sunday } = getWeekDates(new Date());
    if (newDate >= monday && newDate <= sunday) {
      setCurrentDate(newDate);
    }
  };

  const goToday = () => {
    setCurrentDate(new Date());
  };

  const handleWorkClick = (work: Work) => {
    setSelectedWork(work);
    setIsDialogOpen(true);
  };

  const isCurrentHour = (hour: string) => {
    const currentHour = new Date().getHours();
    return parseInt(hour) === currentHour;
  };

  const renderField = (icon: React.ReactNode, label: string, value: string) => (
    <div className="flex items-center space-x-2">
      <div className="text-lavender">{icon}</div>
      <span className="font-semibold">{label}:</span>
      <span>{value}</span>
    </div>
  );

  const renderDayView = () => (
    <ScrollArea ref={scrollRef} className="h-[calc(100vh-12rem)] w-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="pr-4"
      >
        {hours.map((hour) => (
          <motion.div
            key={hour}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: parseInt(hour) * 0.02 }}
            className={`flex items-stretch text-xl ${
              hour === hours[0] ? "" : "border-t-2"
            } border-gray-300 h-20`}
          >
            <span
              className={`w-24 text-sub-text1 py-2 sticky left-0 z-20 ${
                isCurrentHour(hour) ? "bg-lavender/10" : "bg-white"
              }`}
            >
              {hour}
            </span>
            <div className={`flex-1 relative`}>
              {isCurrentHour(hour) && (
                <div className="absolute inset-0 bg-lavender/10 z-0"></div>
              )}

              {works
                .filter((work) => {
                  const workDate = new Date(work.iso_datetime);
                  return (
                    workDate.getHours() === parseInt(hour) &&
                    workDate.getDate() === currentDate.getDate() &&
                    workDate.getMonth() === currentDate.getMonth() &&
                    workDate.getFullYear() === currentDate.getFullYear()
                  );
                })
                .map((work, index) => {
                  const workDate = new Date(work.iso_datetime);
                  return (
                    <div
                      key={index}
                      className="absolute left-0 right-0 border-l-8 border-lavender p-2 rounded-md cursor-pointer bg-[#dfe8ff] hover:bg-[#c5d4ff] transition-colors overflow-hidden z-10"
                      style={{
                        top: "0px",
                        height: "80px", // Assuming 1 hour duration for simplicity
                      }}
                      onClick={() => handleWorkClick(work)}
                    >
                      <p className="text-lg font-semibold truncate">
                        {work.name}
                      </p>
                      <p className="text-md text-sub-text1 truncate">
                        {`${workDate.getHours()}:${workDate
                          .getMinutes()
                          .toString()
                          .padStart(2, "0")}`}
                      </p>
                    </div>
                  );
                })}
            </div>
          </motion.div>
        ))}
      </motion.div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );

  const { monday, sunday } = getWeekDates(new Date());
  const isCurrentWeek =
    currentDate >= monday &&
    currentDate <= sunday;

  return (
    <Card className="w-full h-full p-4">
      <CardHeader className="flex flex-col space-y-2 sm:flex-row sm:items-end sm:justify-between sm:space-y-0 pb-4">
        <CardTitle className="flex flex-col gap-2 font-bold">
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl text-sub-text1"
          >
            {currentDate.toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </motion.p>
        </CardTitle>
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <Button
            className="bg-base text-sub-text1 hover:bg-base/75 font-semibold"
            size="icon"
            onClick={() => navigateCalendar(-1)}
            disabled={currentDate <= monday}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            className="bg-base text-sub-text1 hover:bg-base/75 font-semibold text-lg"
            onClick={goToday}
            disabled={!isCurrentWeek}
          >
            Hôm nay
          </Button>
          <Button
            className="bg-base text-sub-text1 hover:bg-base/75 font-semibold"
            size="icon"
            onClick={() => navigateCalendar(1)}
            disabled={currentDate >= sunday}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </motion.div>
      </CardHeader>
      <CardContent className="p-0">{renderDayView()}</CardContent>

      <AnimatePresence>
        {isDialogOpen && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-[98%] rounded-xl sm:rounded-2xl sm:max-w-[70%]">
              <DialogHeader>
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <DialogTitle className="text-lavender text-3xl">
                    {selectedWork?.name}
                  </DialogTitle>
                </motion.div>
                <DialogDescription>
                  <motion.div
                    className="mt-6 space-y-4 text-2xl"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    {renderField(
                      <MapPin className="h-5 w-5" />,
                      "Địa điểm",
                      selectedWork?.location || ""
                    )}
                    {renderField(
                      <Clock className="h-5 w-5" />,
                      "Thời gian",
                      new Date(selectedWork?.iso_datetime || "").toLocaleString(
                        "vi-VN"
                      )
                    )}
                    {renderField(
                      <User className="h-5 w-5" />,
                      "Thành phần",
                      selectedWork?.attendees || ""
                    )}
                    {selectedWork?.preparation &&
                      renderField(
                        <CalendarIcon className="h-5 w-5" />,
                        "Chuẩn bị",
                        selectedWork.preparation
                      )}
                  </motion.div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Button
                    onClick={() => setIsDialogOpen(false)}
                    className="font-semibold bg-lavender hover:bg-lavender/90 text-xl p-4"
                  >
                    Đóng
                  </Button>
                </motion.div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default WeeklySchedule;