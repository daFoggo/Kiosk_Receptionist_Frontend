"use client";
// Libraries
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Components and Icons
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Calendar as CalendarIcon,
  User,
  Loader2,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Interfaces and utils
import { IStudentCalendarProps } from "@/models/StudentCalendar/StudentCalendar";

// Utilities
export const getCoursesForToday = ({ calendarData }: IStudentCalendarProps) => {
  const today = new Date();
  return calendarData.filter((course) => {
    const courseDate = parseDate(course.startTime);
    return (
      courseDate.getDate() === today.getDate() &&
      courseDate.getMonth() === today.getMonth() &&
      courseDate.getFullYear() === today.getFullYear()
    );
  });
};

const generateHours = () => {
  return Array.from({ length: 17 }, (_, i) => {
    const hour = i + 6 < 10 ? `0${i + 6}` : `${i + 6}`;
    return `${hour}:00`;
  });
};

const generateWeekDays = (date: Date) => {
  const week = [];
  const monday = new Date(date);
  const currentDay = date.getDay();
  const daysToMonday = currentDay === 0 ? 6 : currentDay - 1;
  monday.setDate(date.getDate() - daysToMonday);

  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    week.push(day);
  }
  return week;
};

const parseDate = (dateString: string) => {
  const [time, date] = dateString.split(" ");
  const [day, month, year] = date.split("/");
  const [hour, minute] = time.split(":");
  return new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hour),
    parseInt(minute)
  );
};

const getWeekStartDate = (date: Date): Date => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
};

const StudentCalendar = ({
  calendarData,
  onWeekChange,
  isLoading,
}: IStudentCalendarProps) => {
  // States and Variables
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState("day");
  const hours = generateHours();
  const weekDays = generateWeekDays(currentDate);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Effects
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 8 * 60);
    }
  }, [viewMode]);

  // Handlers
  const navigateCalendar = async (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);

    if (viewMode === "week") {
      const weekStart = getWeekStartDate(newDate);
      await onWeekChange(weekStart);
    }
  };

  const goToday = async () => {
    const today = new Date();
    setCurrentDate(today);

    if (viewMode === "week") {
      const weekStart = getWeekStartDate(today);
      await onWeekChange(weekStart);
    }
  };

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  // Utilities
  const isCurrentHour = (hour: string) => {
    const currentHour = new Date().getHours();
    return parseInt(hour) === currentHour;
  };

  const isCurrentDate = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const convertColor = (value: string, type: string) => {
    if (type === "badge") {
      if (value === "Lịch học" || value === "Lịch giảng dạy") {
        return "bg-indigo-500 hover:bg-indigo-500/90";
      } else if (value === "Lịch thực hành") {
        return "bg-sand hover:bg-sand/90 text-sub-text1";
      }
    } else if (type === "div") {
      if (value === "Lịch học" || value === "Lịch giảng dạy") {
        return "bg-[#dfe8ff]  border-[#7287fd] hover:bg-[#c5d4ff]";
      } else if (value === "Lịch thực hành") {
        return "bg-[#f9f3a7]  border-[#efd020] hover:bg-[#f4e065]";
      }
    }
  };

  // Render Functions
  const renderField = (icon: React.ReactNode, label: string, value: string) => (
    <div className="flex items-center space-x-2">
      <div className="text-indigo-500">{icon}</div>
      <span className="font-semibold">{label}:</span>
      {label === "Loại lịch" ? (
        <Badge
          className={`text-xl px-4 py-1 items-center font-semibold ${convertColor(
            value,
            "badge"
          )}`}
        >
          {value}
        </Badge>
      ) : (
        <span>{value}</span>
      )}
    </div>
  );

  const renderDayView = () => (
    <ScrollArea ref={scrollRef} className="h-[calc(100vh-12rem)] w-full">
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            {}
            <p className="text-lg text-sub-text1">Đang tải lịch...</p>
          </div>
        </div>
      ) : (
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
                className={`w-24 text-sub-text1 py-2 sticky left-0  z-20 ${
                  isCurrentHour(hour) ? "bg-indigo-500/10" : "bg-white"
                }`}
              >
                {hour}
              </span>
              <div className={`flex-1 relative`}>
                {isCurrentHour(hour) && (
                  <div className="absolute inset-0 bg-indigo-500/10 z-0"></div>
                )}

                {calendarData
                  .filter((course) => {
                    const startDate = parseDate(course.startTime);
                    return (
                      startDate.getHours() === parseInt(hour) &&
                      startDate.getDate() === currentDate.getDate() &&
                      startDate.getMonth() === currentDate.getMonth() &&
                      startDate.getFullYear() === currentDate.getFullYear()
                    );
                  })
                  .map((course, index) => {
                    const startDate = parseDate(course.startTime);
                    const endDate = parseDate(course.endTime);
                    const duration =
                      (endDate.getTime() - startDate.getTime()) /
                      (1000 * 60 * 60);
                    return (
                      <div
                        key={index}
                        className={`absolute left-0 right-0  border-l-8  p-2 rounded-md cursor-pointer  transition-colors overflow-hidden z-10 ${convertColor(
                          course?.eventType,
                          "div"
                        )}`}
                        style={{
                          top: "0px",
                          height: `${duration * 80}px`,
                        }}
                        onClick={() => handleEventClick(course)}
                      >
                        <p className="text-lg font-semibold truncate">
                          {course.courseName}
                        </p>
                        <p className="text-md text-sub-text1 truncate">{`${startDate.getHours()}:${startDate
                          .getMinutes()
                          .toString()
                          .padStart(2, "0")} - ${endDate.getHours()}:${endDate
                          .getMinutes()
                          .toString()
                          .padStart(2, "0")}`}</p>
                      </div>
                    );
                  })}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );

  const renderWeekView = () => (
    <ScrollArea ref={scrollRef} className="w-full h-[calc(100vh-12rem)]">
      <div className="w-full min-w-[1200px] ">
        <div className="flex sticky top-0 bg-white z-10">
          <div className="w-24"></div>
          {weekDays.map((day, index) => (
            <div
              key={index}
              className={`flex-1 text-center p-2 text-lg font-semibold border-gray-200 min-w-[150px]
              ${
                isCurrentDate(day) ? "bg-indigo-500 text-white rounded-md" : ""
              }`}
            >
              <div>{day.toLocaleDateString("vi-VN", { weekday: "short" })}</div>
              <div>{day.getDate()}</div>
            </div>
          ))}
        </div>
        {hours.map((hour) => (
          <div
            key={hour}
            className="flex items-stretch border-t-2 border-gray-200 h-20"
          >
            <span className="w-24 text-lg text-sub-text1 py-2 sticky left-0 bg-white z-20">
              {hour}
            </span>
            {weekDays.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className="flex-1 relative border-l-2 border-gray-100 min-w-[150px]"
              >
                {isCurrentDate(day) && (
                  <div className="absolute inset-0 bg-indigo-500/10 z-0"></div>
                )}
                {calendarData
                  .filter((course) => {
                    const startDate = parseDate(course.startTime);
                    return (
                      startDate.getHours() === parseInt(hour) &&
                      startDate.getDate() === day.getDate() &&
                      startDate.getMonth() === day.getMonth() &&
                      startDate.getFullYear() === day.getFullYear()
                    );
                  })
                  .map((course, index) => {
                    const startDate = parseDate(course.startTime);
                    const endDate = parseDate(course.endTime);
                    const duration =
                      (endDate.getTime() - startDate.getTime()) /
                      (1000 * 60 * 60);
                    return (
                      <div
                        key={index}
                        className={`absolute top-0 left-0 right-0 border-l-8 p-1 ml-1 rounded-md cursor-pointer  transition-colors overflow-hidden z-10 ${convertColor(
                          course?.eventType,
                          "div"
                        )}`}
                        style={{
                          height: `${duration * 80}px`,
                        }}
                        onClick={() => handleEventClick(course)}
                      >
                        <p className="text-md font-semibold truncate">
                          {course.courseName}
                        </p>
                        <p className="text-sm text-sub-text1 truncate">{`${startDate.getHours()}:${startDate
                          .getMinutes()
                          .toString()
                          .padStart(2, "0")} - ${endDate.getHours()}:${endDate
                          .getMinutes()
                          .toString()
                          .padStart(2, "0")}`}</p>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );

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
            {viewMode === "day"
              ? currentDate.toLocaleDateString("vi-VN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : `Từ ${weekDays[0].toLocaleDateString("vi-VN", {
                  month: "short",
                  day: "numeric",
                })} đến ${weekDays[6].toLocaleDateString("vi-VN", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}`}
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
            onClick={() => navigateCalendar(viewMode === "day" ? -1 : -7)}
            disabled={isLoading}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            className="bg-base text-sub-text1 hover:bg-base/75 font-semibold text-lg"
            onClick={goToday}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang tải...
              </div>
            ) : viewMode === "day" ? (
              "Hôm nay"
            ) : (
              "Tuần này"
            )}
          </Button>
          <Button
            className="bg-base text-sub-text1 hover:bg-base/75 font-semibold"
            size="icon"
            onClick={() => navigateCalendar(viewMode === "day" ? 1 : 7)}
            disabled={isLoading}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </motion.div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs
          value={viewMode}
          onValueChange={setViewMode}
          className="w-full text-lg"
        >
          <TabsList className="flex w-full justify-between p-2">
            <TabsTrigger
              value="day"
              className="font-semibold text-lg flex-1 rounded-md p-2"
            >
              Trong ngày
            </TabsTrigger>
            <TabsTrigger
              value="week"
              className="font-semibold text-lg flex-1 rounded-md p-2"
            >
              Trong tuần
            </TabsTrigger>
          </TabsList>
          <AnimatePresence>
            {viewMode === "day" && (
              <motion.div
                key="day"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="day">{renderDayView()}</TabsContent>
              </motion.div>
            )}
            {viewMode === "week" && (
              <motion.div
                key="week"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="week">{renderWeekView()}</TabsContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Tabs>
      </CardContent>

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
                  <DialogTitle className="text-indigo-500 text-3xl">
                    {selectedEvent?.courseName}
                  </DialogTitle>
                </motion.div>
                <DialogDescription>
                  <motion.div
                    className="mt-6 space-y-4 text-2xl"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    {/* Course info */}
                    {renderField(
                      <MapPin className="h-5 w-5" />,
                      "Loại lịch",
                      selectedEvent?.eventType
                    )}
                    {renderField(
                      <MapPin className="h-5 w-5" />,
                      "Phòng",
                      selectedEvent?.room
                    )}
                    {renderField(
                      <Clock className="h-5 w-5" />,
                      "Thời gian",
                      `${selectedEvent?.startTime} - ${selectedEvent?.endTime}`
                    )}
                    {renderField(
                      <CalendarIcon className="h-5 w-5" />,
                      "Lớp tín chỉ",
                      selectedEvent?.creditClass
                    )}
                    {renderField(
                      <User className="h-5 w-5" />,
                      "Giảng viên",
                      selectedEvent?.instructor
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
                    className="font-semibold bg-indigo-500 hover:bg-indigo-500/90 text-xl p-4"
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

export default StudentCalendar;
