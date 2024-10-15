"use client";

import { useEffect, useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  FileText,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { CalendarData } from "@/types/CalendarData";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import WeeklySchedule from "./WeeklySchedule";
import axios from "axios";
import { ipGetCalendar } from "@/utils/ip";
import { truncateText } from "@/utils/truncateText";

const WeeklyCalendar = () => {
  const [calendar, setCalendar] = useState<CalendarData | null>(null);
  const [fullCalendar, setFullCalendar] = useState<CalendarData[]>([]);

  const calendarRef = useRef<HTMLDivElement>(null);


  // enable scroll
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (calendarRef.current) {
        e.preventDefault();
        calendarRef.current.scrollTop += e.deltaY;
      }
    };

    const calendar = calendarRef.current;
    if (calendar) {
      calendar.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (calendar) {
        calendar.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  useEffect(() => {
    getCalendarData();
  }, []);

  // fetch data
  const getCalendarData = async () => {
    try {
      const response = await axios.get(ipGetCalendar);
      const calendarData = response.data;
      setFullCalendar(calendarData);
      const nextWork = findUpcomingWork(calendarData);
      setCalendar(nextWork);
    } catch (error) {
      toast.error("Lấy dữ liệu lịch tuần thất bại");
      console.error(error);
    }
  };

  // tim lich sap toi trong ngay
  const findUpcomingWork = (works: CalendarData[]): CalendarData | null => {
    const currentTime = new Date();
    const todayStart = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      0,
      0,
      0,
      0
    ).getTime();

    const todayEnd = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      23,
      59,
      59,
      999
    ).getTime();

    // lay lich trong gio sap toi. neu khong con thi lay lich cuoi cung trong ngay
    const todayEvents = works.filter((work: CalendarData) => {
      const workTime = new Date(work.iso_datetime.toString()).getTime();
      return workTime >= todayStart && workTime <= todayEnd;
    });

    // neu hom nay khong co lich thi tra ve null
    if (todayEvents.length === 0) {
      return null;
    }

    const currentTimeMillis = currentTime.getTime();
    const upcomingEvent = todayEvents.find((work: CalendarData) => {
      const workTime = new Date(work.iso_datetime.toString()).getTime();
      return workTime > currentTimeMillis;
    });

    return upcomingEvent || todayEvents[todayEvents.length - 1];
  };

  const renderField = (
    icon: React.ReactNode,
    label: string,
    value: string | undefined
  ) => {
    if (!value || value === "") return null;
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 min-w-[150px] text-sub-text1">
          {icon}
          <Label className="text-lg font-semibold">{label}</Label>
        </div>
        <Input value={value} readOnly className="text-lg" tabIndex={-1} />
      </div>
    );
  };

  return (
    <div
      className="h-full flex flex-col bg-white p-4 rounded-2xl border border-slate-300 shadow-sm"
      ref={calendarRef}
    >
      <div className="flex items-center gap-2 mb-4 text-xl font-semibold text-indigo-950">
        <BriefcaseBusiness />
        <h1>Lịch công tác hôm nay</h1>
      </div>
      {calendar ? (
        <h1 className="text-xl font-semibold text-indigo-500 mb-4">
          { truncateText(calendar?.name as string, 40)}
        </h1>
      ) : (
        <p className="text-xl text-left text-sub-text1 font-semibold">
          Không có lịch công tác hôm nay
        </p>
      )}

      <div className="flex items-center justify-between">
        {calendar ? (
          <Badge
            variant="secondary"
            className="text-lg font-semibold px-3 py-1 bg-crust"
          >
            <Clock className="mr-2 h-4 w-4" />
            <span>
              {new Date(calendar?.iso_datetime.toString()).toLocaleTimeString(
                "en-US",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }
              )}
            </span>
          </Badge>
        ) : (
          <div></div>
        )}
        <Sheet>
          <SheetTrigger>
            <Button
              variant="ghost"
              className="font-semibold text-sub-text1 text-lg rounded-full hover:bg-crust/50 mt-auto flex items-center justify-between "
            >
              Chi tiết
              <ArrowUpRight className="ml-2 h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-4xl [&>button]:hidden overflow-y-hidden h-dvh">
            <SheetHeader>
              <div className="flex justify-between items-center text-center mb-6">
                <SheetTitle className="text-3xl text-indigo-950">
                  Chi tiết công tác
                </SheetTitle>
                <SheetClose>
                  <Button variant="ghost" className="text-sub-text1">
                    <X />
                  </Button>
                </SheetClose>
              </div>
              <SheetDescription
                className={`space-y-6 mt-6 ${
                  calendar ? "border-b-2 pb-6" : ""
                }`}
              >
                {renderField(
                  <CalendarDays className="h-6 w-6 text-indigo-500" />,
                  "Thời gian:",
                  calendar
                    ? new Date(
                        calendar?.iso_datetime.toString()
                      ).toLocaleDateString("vi-VN") +
                        " " +
                        new Date(
                          calendar?.iso_datetime.toString()
                        ).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })
                    : ""
                )}
                {renderField(
                  <MapPin className="h-6 w-6 text-indigo-500" />,
                  "Địa điểm:",
                  calendar?.location as string
                )}
                {renderField(
                  <Users className="h-6 w-6 text-indigo-500" />,
                  "Thành phần:",
                  calendar?.attendees as string
                )}
                {renderField(
                  <FileText className="h-6 w-6 text-indigo-500" />,
                  "Chuẩn bị:",
                  calendar?.preparation as string
                )}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 h-full">
              <h1 className="text-2xl font-bold text-indigo-950 mb-4">
                Toàn bộ lịch công tác
              </h1>
              <div className="overflow-auto h-[80%]">
                <WeeklySchedule works={fullCalendar} ></WeeklySchedule>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default WeeklyCalendar;
