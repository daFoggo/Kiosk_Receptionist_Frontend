import { useEffect, useState } from "react";
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
  ChevronDown,
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

const WeeklyCalendar = () => {
  const [calendar, setCalendar] = useState<CalendarData>({
    iso_datetime: "",
    name: "",
    location: "",
    attendees: "",
    preparation: "",
  });
  const [fullCalendar, setFullCalendar] = useState<CalendarData[]>([]);

  useEffect(() => {
    getCalendarData();
  }, []);

  const getCalendarData = async () => {
    try {
      const response = await axios.get(ipGetCalendar);
      const calendarData = response.data[0];
      const nextWork = findUpcomingWork(calendarData);
      setFullCalendar(calendarData);
      setCalendar(nextWork);
    } catch (error) {
      toast.error("Lấy dữ liệu lịch tuần thất bại");
      console.error(error);
    }
  };

  // set lich sap toi
  const findUpcomingWork = (works: CalendarData[]): CalendarData => {
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

    const todayEvents = works.filter((work: CalendarData) => {
      const workTime = new Date(work.iso_datetime.toString()).getTime();
      return workTime >= todayStart && workTime <= todayEnd;
    });

    if (todayEvents.length === 0) {
      return works[0];
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
    if (!value) return null;
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 min-w-[150px] text-sub-text1">
          {icon}
          <Label className="text-lg">{label}</Label>
        </div>
        <Input value={value} readOnly className="text-lg" tabIndex={-1} />
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-base p-4 rounded-2xl border shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-xl font-semibold">
        <BriefcaseBusiness className="text-heading" />
        <h1>Lịch công tác hôm nay</h1>
      </div>
      <h1 className="text-2xl font-semibold text-lavender mb-4">
        {calendar?.name}
      </h1>
      <div className="flex items-center justify-between">
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
        <Sheet>
          <SheetTrigger>
            <Button
              variant="ghost"
              className="font-semibold text-sub-text1 text-lg rounded-full hover:bg-crust/50 mt-auto flex items-center justify-between"
            >
              Chi tiết
              <ArrowUpRight className="ml-2 h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-4xl [&>button]:hidden">
            <SheetHeader>
              <div className="flex justify-between items-center text-center mb-6">
                <SheetTitle className="text-3xl text-heading">
                  Chi tiết công tác
                </SheetTitle>
                <SheetClose>
                  <Button variant="ghost" className="text-sub-text1">
                    <X />
                  </Button>
                </SheetClose>
              </div>
              <SheetDescription className="space-y-6 mt-6 border-b-2 pb-6">
                {renderField(
                  <CalendarDays className="h-6 w-6" />,
                  "Thời gian:",
                  new Date(
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
                )}
                {renderField(
                  <MapPin className="h-6 w-6" />,
                  "Địa điểm:",
                  calendar?.location as string
                )}
                {renderField(
                  <Users className="h-6 w-6" />,
                  "Thành phần:",
                  calendar?.attendees as string
                )}
                {renderField(
                  <FileText className="h-6 w-6" />,
                  "Chuẩn bị:",
                  calendar?.preparation as string
                )}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
                <h1 className="text-2xl font-bold text-heading mb-4">Toàn bộ lịch công tác</h1>
                <WeeklySchedule tasks={fullCalendar}></WeeklySchedule>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default WeeklyCalendar;
