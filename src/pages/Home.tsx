import { useEffect, useRef, useState } from "react";
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
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import StudentCalendar, { Course } from "./StudentCalendar";
import { motion } from "framer-motion";
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";

const Home = () => {
  const cameraRef = useRef<Webcam>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [calendarData, setCalendarData] = useState<Course[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

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

  const getCalendarData = async () => {
    try {
      const response = await axios.get(ipGetStudentCalendar);
      console.log(response.data)
      setCalendarData(response.data)
    } catch (error) {
      console.error("Error getting event data:", error);
    }
  }

  const handleVerificationComplete = () => {
    transitionToState(InteractionState.CONTACT_DEPARTMENT);
  };

  const handleContactComplete = () => {
    transitionToState(InteractionState.IDLE);
  };

  const renderInteractionArea = () => {
    switch (currentState) {
      case InteractionState.GUEST_VERIFICATION:
        return (
          <ScanCCCD
            cccdData={cccdData}
            currentRole={currentRole}
            onVerificationComplete={handleVerificationComplete}
          />
        );
      case InteractionState.CONTACT_DEPARTMENT:
        return (
          <Contact
            cccdData={cccdData}
            onContactingComplete={handleContactComplete}
          />
        );
      default:
        return (
          <div className="flex flex-col items-center gap-6">
            <Camera
              webcamData={webcamData}
              cameraRef={cameraRef}
              isConnected={isConnected}
            />
            {currentState === InteractionState.STUDENT && (
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
                    <SheetTitle className="text-2xl font-bold ">
                      Chi tiết lịch học
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 h-[calc(100vh-100px)]">
                    <StudentCalendar calendarData={calendarData}/>
                  </div>
                  <Button
                    className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 bg-lavender hover:bg-lavender/90 p-2 rounded-full"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    <PanelLeftClose className="font-semibold w-6 h-6" />
                  </Button>
                </SheetContent>
              </Sheet>
            )}
          </div>
        );
    }
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
          <AIModel videoPath={videoPath} />
          <AIChat message={message} />
        </div>
        <div className="w-1/2">{renderInteractionArea()}</div>
      </div>
    </div>
  );
};

export default Home;
