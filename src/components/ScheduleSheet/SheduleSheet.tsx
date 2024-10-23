// Libraries
import { motion } from "framer-motion";

// Components and Icons
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import StudentCalendar from "../StudentCalendar/StudentCalendar";
import { IScheduleSheetProps } from "@/models/ScheduleSheet/ScheduleSheet";

const ScheduleSheet = ({
  isSheetOpen,
  setIsSheetOpen,
  currentRole,
  scheduleData,
  getScheduleData,
  isLoading,
}: IScheduleSheetProps) => {
  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <motion.div
          className="container-btn"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
        >
          {currentRole === "STUDENT" || currentRole === "STAFF" ? (
            <Button className="bg-indigo-500 font-semibold hover:bg-indigo-500/90 py-6 px-8 text-xl border shadow-sm rounded-xl flex items-center justify-between gap-2">
              <p>
                {currentRole === "STUDENT"
                  ? "Hiển thị lịch học chi tiết"
                  : "Hiển thị lịch giảng dạy chi tiết"}
              </p>
              <PanelLeftOpen className="font-semibold w-6 h-6" />
            </Button>
          ) : null}
        </motion.div>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-7xl">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">
            {currentRole === "STUDENT"
              ? "Chi tiết lịch học"
              : "Chi tiết lịch giảng dạy"}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 h-[calc(100vh-100px)]">
          <StudentCalendar
            calendarData={scheduleData}
            onWeekChange={getScheduleData}
            isLoading={isLoading}
          />
        </div>
        <Button
          className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 bg-indigo-500 hover:bg-indigo-500/90 p-2 rounded-full"
          onClick={() => setIsSheetOpen(false)}
        >
          <PanelLeftClose className="font-semibold w-6 h-6" />
        </Button>
      </SheetContent>
    </Sheet>
  );
};

export default ScheduleSheet;
