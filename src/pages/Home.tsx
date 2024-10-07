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
import { ipGetCalendar, ipGetEvents, ipGetStudentCalendar, ipWebsocket } from "../utils/ip";
import WeeklyCalendar from "@/components/WeeklyCalendar";
import Contact from "@/components/Contact";
import wavyLavender from "../assets/background_layer/lavender_wave.svg";
import { useInteraction, InteractionState } from "../hooks/useInteraction";
import { useWebSocket } from "../hooks/useWebsocket";
import { Button } from "@/components/ui/button";
import { Loader2, PanelLeftClose, PanelLeftOpen, ScanLine, UserCheck } from "lucide-react";
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

const Home = () => {
  const cameraRef = useRef<Webcam>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [calendarData, setCalendarData] = useState<Course[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { isConnected, webcamData, cccdData, currentRole } = useWebSocket({
    webSocketUrl: ipWebsocket,
    cameraRef,
  });

  const {
    message,
    videoPath,
    currentState,
    transitionToState,
  } = useInteraction({
    webcamData,
    currentRole,
    studentSchedule: calendarData,
    eventData: events[0],
  });

  useEffect(() => {
    getEventData();
    getCalendarData();
  }, []);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentState]);

  // loc cac su kien trong tuan
  const filterEventsInWeek = useMemo(() => (events: Event[]) => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(now.getDate() + (6 - now.getDay())));
    const filteredEvents = events.filter((event) => {
      const eventDate = new Date(event.start_time);
      return eventDate >= startOfWeek && eventDate <= endOfWeek;
    });
    return filteredEvents.length > 0 ? filteredEvents : [events[0]];
  }, []);

  // fetch event data
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

  // fetch calendar data
  const getCalendarData = async () => {
    try {
      const response = await axios.get(ipGetStudentCalendar);
      setCalendarData(response.data);
    } catch (error) {
      console.error("Error getting calendar data:", error);
    }
  };

  // chuyen state sau khi xac minh thong tin
  const handleVerificationComplete = () => {
    transitionToState(InteractionState.CONTACT_DEPARTMENT);
  };

  // chuyen state sau khi lien he hoan tat
  const handleContactComplete = () => {
    transitionToState(InteractionState.IDLE);
  };

  const handleVerificationButtonClick = () => {
    transitionToState(InteractionState.GUEST_VERIFICATION);
  };

  // toi uu component bang memoiz
 // toi uu component bang memoiz
  const MemoizedCamera = useMemo(
    () => (
      <Camera
        webcamData={webcamData}
        cameraRef={cameraRef}
        isConnected={isConnected}
      />
    ),
    [webcamData.nums_of_people, isConnected]
  );

  const MemoizedStudentSheet = useMemo(
    () => (
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <Button className="bg-lavender font-semibold hover:bg-lavender/90 py-6 px-8 text-xl border shadow-sm rounded-xl flex items-center justify-between gap-2">
              <p>Hiển thị lịch học chi tiết</p>
              <PanelLeftOpen className="font-semibold w-6 h-6" />
            </Button>
          </motion.div>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-7xl">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold">
              Chi tiết lịch học
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6 h-[calc(100vh-100px)]">
            <StudentCalendar calendarData={calendarData} />
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
    [isSheetOpen, calendarData]
  );

  const MemoizedAIModel = useMemo(() => <AIModel videoPath={videoPath} />, [videoPath]);
  const MemoizedAIChat = useMemo(() => <AIChat message={message} />, [message]);

  // render component tuy theo cac state
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
            />
          ) : currentState === InteractionState.CONTACT_DEPARTMENT ? (
            <Contact
              cccdData={cccdData}
              onContactingComplete={handleContactComplete}
            />
          ) : (
            <div className="flex flex-col items-center gap-6">
              {MemoizedCamera}
              {currentState === InteractionState.STUDENT && MemoizedStudentSheet}
              {currentState !== InteractionState.GREETING && (
                <motion.div
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
                    <ScanLine  className="font-semibold w-6 h-6" />
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
        <div className="w-1/2">{renderInteractionArea()}</div>
      </div>
    </div>
  );
};

export default Home;