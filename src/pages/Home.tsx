import { useEffect, useRef, useState, useMemo } from "react";
import Webcam from "react-webcam";
import LunarCalendar from "../components/LunarCalendar";
import Camera from "../components/Camera";
import EventBanner, { Event } from "../components/EventBanner";
import Weather from "./Weather";
import AIModel from "../components/AIModel";
import AIChat from "../components/AIChat";
import ScanCCCD from "../components/ScanCCCD";
import "./pageRestrictions.css";
import {
  ipGetEvents,
  ipGetStudentCalendar,
  ipGetInstructorCalendar,
  ipWebsocket,
} from "../utils/ip";
import WeeklyCalendar from "@/components/WeeklyCalendar";
import Contact from "@/components/Contact";
import wavyLavender from "../assets/background_layer/lavender_wave.svg";
import { useInteraction, InteractionState } from "../hooks/useInteraction";
import { useWebSocket } from "../hooks/useWebsocket";
import { useCCCDVerification } from "@/hooks/useCCCDVerification";
import { Button } from "@/components/ui/button";
import { Loader2, PanelLeftClose, PanelLeftOpen, ScanLine } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import StudentCalendar, { Course } from "@/components/StudentCalendar";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";

type ScheduleData = Course[];

const Home = () => {
  const webcamRef = useRef<Webcam>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState<ScheduleData>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    isConnected,
    webcamData,
    cccdData,
    currentRole,
    currentCccd,
    resetCccdData,
  } = useWebSocket({
    webSocketUrl: ipWebsocket,
    cameraRef: webcamRef,
  });

  const { message, videoPath, currentState, transitionToState } =
    useInteraction({
      webcamData,
      currentRole,
      schedule: scheduleData,
      eventData: events[0],
      resetCccdData,
    });

  const { isVerifying, currentStep, startVerification, completeVerification } =
    useCCCDVerification({
      webcamData,
      currentRole,
      resetCccdData,
      transitionToState,
    });

  useEffect(() => {
    getEventData();
    if (currentRole === "STUDENT" || currentRole === "STAFF") {
      getScheduleData();
    }
  }, [currentRole, currentCccd]);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentState]);

  const filterEventsInWeek = useMemo(
    () => (events: Event[]) => {
      const now = new Date();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      const endOfWeek = new Date(
        now.setDate(now.getDate() + (6 - now.getDay()))
      );
      const filteredEvents = events.filter((event) => {
        const eventDate = new Date(event.start_time);
        return eventDate >= startOfWeek && eventDate <= endOfWeek;
      });
      return filteredEvents.length > 0 ? filteredEvents : [events[0]];
    },
    []
  );

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

  const getScheduleData = async (startDate?: Date) => {
    if (!currentRole || !currentCccd) return;

    try {
      setIsLoading(true);
      let url =
        currentRole === "STUDENT"
          ? `${ipGetStudentCalendar}/${currentCccd}`
          : `${ipGetInstructorCalendar}/123456789`;

      if (startDate) {
        const formattedDate = formatDateForApi(startDate);
        url += `?ngaybatdau=${formattedDate}`;
      }

      const response = await axios.get(url);
      setScheduleData(response.data);
    } catch (error) {
      console.error("Error getting schedule data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateForApi = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleWeekChange = async (startDate: Date) => {
    await getScheduleData(startDate);
  };

  const handleContactComplete = () => {
    transitionToState(InteractionState.IDLE);
  };

  const handleVerificationButtonClick = () => {
    startVerification();
  };

  const handleVerificationComplete = () => {
    completeVerification();
  };

  const MemoizedCamera = useMemo(
    () => (
      <Camera
        webcamData={webcamData}
        cameraRef={webcamRef}
        isConnected={isConnected}
      />
    ),
    [webcamData.nums_of_people, isConnected]
  );

  const MemoizedScheduleSheet = useMemo(
    () => (
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <motion.div
            className="container-btn"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            {currentRole === "STUDENT" ? (
              <Button className="bg-lavender font-semibold hover:bg-lavender/90 py-6 px-8 text-xl border shadow-sm rounded-xl flex items-center justify-between gap-2">
                <p>Hiển thị lịch học chi tiết</p>
                <PanelLeftOpen className="font-semibold w-6 h-6" />
              </Button>
            ) : currentRole === "STAFF" ? (
              <Button className="bg-lavender font-semibold hover:bg-lavender/90 py-6 px-8 text-xl border shadow-sm rounded-xl flex items-center justify-between gap-2">
                <p>Hiển thị lịch giảng dạy chi tiết</p>
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
                : currentRole === "STAFF"
                ? "Chi tiết lịch giảng dạy"
                : ""}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6 h-[calc(100vh-100px)]">
            <StudentCalendar
              calendarData={scheduleData}
              onWeekChange={handleWeekChange}
              isLoading={isLoading}
            />
          </div>
          <Button
            className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 bg-lavender hover:bg-lavender/90 p-2 rounded-full"
            onClick={() => setIsSheetOpen(false)}
          >
            <PanelLeftClose className="font-semibold w-6 h-6" />
          </Button>
        </SheetContent>
      </Sheet>
    ),
    [isSheetOpen, scheduleData, currentRole]
  );

  const MemoizedAIModel = useMemo(
    () => <AIModel videoPath={videoPath} />,
    [videoPath]
  );
  const MemoizedAIChat = useMemo(() => <AIChat message={message} />, [message]);

  const renderInteractionArea = () => {
    if (isTransitioning) {
      return (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-16 w-16 animate-spin text-sub-text1/10" />
        </div>
      );
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentState}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentState === InteractionState.GUEST_VERIFICATION ? (
            <ScanCCCD
              cccdData={cccdData}
              currentRole={currentRole}
              onVerificationComplete={handleVerificationComplete}
              webcamRef={webcamRef}
            />
          ) : currentState === InteractionState.CONTACT_DEPARTMENT ? (
            <Contact
              cccdData={cccdData}
              onContactingComplete={handleContactComplete}
              resetCccdData={resetCccdData}
            />
          ) : (
            <div className="flex flex-col items-center gap-6">
              {(currentState === InteractionState.STUDENT ||
                currentState === InteractionState.STAFF) &&
                MemoizedScheduleSheet}
              {currentState === InteractionState.GREETING && (
                <motion.div
                  className="container-btn"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <Button
                    className="bg-lavender font-semibold hover:bg-lavender/90 py-6 px-8 text-xl border shadow-sm rounded-xl flex items-center justify-between gap-2"
                    onClick={handleVerificationButtonClick}
                  >
                    <p>Xác thực thông tin khách</p>
                    <ScanLine className="font-semibold w-6 h-6" />
                  </Button>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="flex flex-col gap-6 px-6 py-3 page-restrictions relative overflow-hidden h-screen">
      <div
        className="absolute inset-x-0 bottom-0 -z-10"
        style={{
          backgroundImage: `url(${wavyLavender})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom",
          backgroundSize: "100% auto",
          height: "100%",
          bottom: "50px",
        }}
      />

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-3">
          <LunarCalendar />
        </div>
        <div className="col-span-1">
          <Weather />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <EventBanner evenData={events} />
        </div>
        <div className="col-span-1">
          <WeeklyCalendar />
        </div>
      </div>

      <div className="flex flex-row gap-6 h-1/2">
        <div className="w-1/2 flex flex-col items-center aspect-video gap-6">
          {MemoizedAIModel}
          {MemoizedAIChat}
        </div>
        <div className="w-1/2 flex flex-col items-center gap-6">
          {MemoizedCamera}
          {renderInteractionArea()}
        </div>
      </div>
    </div>
  );
};

export default Home;
