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
import mockSchedule from "../sampleData/schedule.json";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ipGetCalendar } from "@/utils/ip";

const WeeklyCalendar = () => {
  const [calendar, setCalendar] = useState<CalendarData>({
    date: "",
    time: "",
    name: "",
    location: "",
    attendees: "",
    preparation: "",
  });
  const [fullCalendar, setFullCalendar] = useState<CalendarData[]>([]);
  const [showWeeklySchedule, setShowWeeklySchedule] = useState(false);

  useEffect(() => {
    getCalendarData();
  }, []);

  const getCalendarData = async () => {
    try {
      const response = await axios.get(ipGetCalendar);
      setFullCalendar(response.data);
      setCalendar(mockSchedule[0]);
    } catch (error) {
      toast.error("Lấy dữ liệu lịch tuần thất bại");
      console.error(error);
    }
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
          <span>{calendar?.time}</span>
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
                <SheetTitle className="text-3xl text-heading">Chi tiết công tác</SheetTitle>
                <SheetClose>
                  <Button variant="ghost" className="text-sub-text1">
                    <X />
                  </Button>
                </SheetClose>
              </div>
              <SheetDescription className="space-y-6 mt-6">
                {renderField(
                  <CalendarDays className="h-6 w-6" />,
                  "Ngày:",
                  calendar?.date as string
                )}
                {renderField(
                  <Clock className="h-6 w-6" />,
                  "Thời gian:",
                  calendar?.time as string
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
              <Button
                onClick={() => setShowWeeklySchedule(!showWeeklySchedule)}
                variant="outline"
                className="w-full justify-between"
              >
                <span className="text-lg text-sub-text1">Toàn bộ công tác trong tuần</span>
                <motion.div
                  animate={{ rotate: showWeeklySchedule ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown />
                </motion.div>
              </Button>
              <AnimatePresence>
                {showWeeklySchedule && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 overflow-hidden"
                  >
                    <div className="overflow-x-auto">
                      <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="whitespace-nowrap">Ngày</TableHead>
                                <TableHead className="whitespace-nowrap">Thời gian</TableHead>
                                <TableHead className="whitespace-nowrap">Nội dung</TableHead>
                                <TableHead className="whitespace-nowrap">Địa điểm</TableHead>
                                <TableHead className="whitespace-nowrap">Thành phần</TableHead>
                                <TableHead className="whitespace-nowrap">Chuẩn bị</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {fullCalendar.map((event, index) => (
                                <TableRow key={index}>
                                  <TableCell className="whitespace-nowrap">{event.date}</TableCell>
                                  <TableCell className="whitespace-nowrap">{event.time}</TableCell>
                                  <TableCell>{event.name}</TableCell>
                                  <TableCell>{event.location}</TableCell>
                                  <TableCell>{event.attendees}</TableCell>
                                  <TableCell>{event.preparation}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default WeeklyCalendar;