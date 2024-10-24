// Library
import {
  useEffect,
  useRef,
  useState,
  useMemo,
  useContext,
  useCallback,
} from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

// Components and Icons
import { Loader2} from "lucide-react";
import Camera from "@/components/Camera/Camera";
import AIChat from "@/components/AIChat/AIChat";
import AIModel from "@/components/AIModel/AIModel";
import EventBanner from "@/components/EventBanner/EventBanner";
import LunarCalendar from "@/components/LunarCalendar/LunarCalendar";
import ScanCCCD from "@/components/ScanCCCD/ScanCCCD";
import WeeklyCalendar from "@/components/WeeklyCalendar/WeeklyCalendar";
import Weather from "@/components/Weather/Weather";
import ScheduleSheet from "@/components/ScheduleSheet/SheduleSheet";

// Contexts and Hooks
import { useInteraction } from "@/context/InteractionContext";
import { WebSocketContext } from "@/context/WebSocketContext";

// Interfaces and utils
import { InteractionState } from "@/models/InteractionContext/InteractionContext";
import { IEvent } from "@/models/Home/Home";
import { ICourse } from "@/models/StudentCalendar/StudentCalendar";
import {
  ipGetEvents,
  ipGetStudentCalendar,
  ipGetInstructorCalendar,
} from "@/utils/ip";
import { getScheduleStateForRole } from "@/utils/helper/interactionHelper";

// Assets
import lavenderWave from "@/assets/Home/lavender_wave.svg";
import GuestInteraction from "@/components/GuestInteraction/GuestInteraction";

const Home = () => {
  // Refs
  const webcamRef = useRef<Webcam>(null);
  const initialLoadCompleted = useRef<{ [key: string]: boolean }>({});

  // States
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState<ICourse[]>([]);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [scheduleLoaded, setScheduleLoaded] = useState(false);

  // Context
  const { cccdData, currentRole, currentCccd, webcamData, resetCccdData } =
    useContext(WebSocketContext);
  const { currentState, message, videoPath, transitionTo } = useInteraction();

  // Effects
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await getEventData();
        setIsInitialLoading(false);
      } catch (error) {
        console.error("Error loading initial data:", error);
        setIsInitialLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (currentRole) {
      initialLoadCompleted.current = {};
      handleRoleChange();
    } else {
      transitionTo(InteractionState.IDLE);
    }

    return () => {
      initialLoadCompleted.current = {};
    };
  }, [currentRole]);

  useEffect(() => {
    const loadSchedule = async () => {
      if (currentRole === "STUDENT" || currentRole === "STAFF") {
        setScheduleLoaded(false);
        await getScheduleData();
        setScheduleLoaded(true);
      }
    };

    if (currentRole) {
      loadSchedule();
    }
  }, [currentRole, currentCccd]);

  useEffect(() => {
    if (!scheduleLoaded || !currentRole) return;

    if (["STUDENT", "STAFF", "INSTRUCTOR"].includes(currentRole)) {
      const roleKey = `${currentRole}-${currentCccd}`;

      if (!initialLoadCompleted.current[roleKey]) {
        const hasSchedule = scheduleData.length > 0;
        const hasData = Boolean(scheduleData);
        const newState = getScheduleStateForRole(
          currentRole,
          hasSchedule,
          hasData
        );

        // Add small delay to ensure proper state transition
        setTimeout(() => {
          transitionTo(newState);
          initialLoadCompleted.current[roleKey] = true;
        }, 100);
      }
    }
  }, [scheduleLoaded, currentRole, scheduleData, currentCccd]);

  useEffect(() => {
    handlePresenceChange();
  }, [webcamData]);

  useEffect(() => {
    handleTransitionAnimation();
  }, [currentState]);

  // Handlers
  const handleRoleChange = () => {
    if (!currentRole) {
      transitionTo(InteractionState.IDLE);
      return;
    }

    if (currentRole === "GUEST") {
      transitionTo(InteractionState.GUEST);
    } else if (!["STUDENT", "STAFF", "INSTRUCTOR"].includes(currentRole)) {
      transitionTo(InteractionState.IDLE);
    }
  };

  const handleTransitionAnimation = () => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
    return () => clearTimeout(timer);
  };

  const handlePresenceChange = useCallback(() => {
    if (!currentRole) {
      initialLoadCompleted.current = {};
    }
  }, [currentRole]);

  const handleVerificationStart = () => {
    transitionTo(InteractionState.SCAN_CCCD_REQUEST);
  };

  const handleScanQRStart = () => {
    transitionTo(InteractionState.SCAN_QR_REQUEST);
  };

  const handleVerificationComplete = () => {
    if (cccdData && Object.keys(cccdData).length > 0) {
      transitionTo(InteractionState.SCAN_CCCD_SUCCESS);
    } else {
      transitionTo(InteractionState.SCAN_CCCD_FAIL);
    }
  };

  const handleContactComplete = () => {
    transitionTo(InteractionState.IDLE);
  };

  // API Calls
  const getEventData = async () => {
    try {
      const response = await axios.get(ipGetEvents);
      const sortedEvents = response.data.sort(
        (a: { start_time: string }, b: { start_time: string }) =>
          new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
      );
      const currentWeekEvents = filterEventsInWeek(sortedEvents);
      setEvents(currentWeekEvents);
    } catch (error) {
      console.error("Error getting event data:", error);
      transitionTo(InteractionState.ERROR);
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
      transitionTo(InteractionState.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  // Utilities
  const filterEventsInWeek = useMemo(
    () => (events: IEvent[]) => {
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

  const formatDateForApi = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Memoized Components
  const MemoizedScheduleSheet = useMemo(
    () => (
      <ScheduleSheet
        isSheetOpen={isSheetOpen}
        setIsSheetOpen={setIsSheetOpen}
        currentRole={currentRole}
        scheduleData={scheduleData}
        getScheduleData={getScheduleData}
        isLoading={isLoading}
      />
    ),
    [isSheetOpen, scheduleData, currentRole, isLoading]
  );

  // Render components based on State
  const renderInteractionArea = () => {
    if (isInitialLoading || (shouldLoadSchedule && !scheduleLoaded)) {
      return (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-16 w-16 animate-spin text-sub-text1/10" />
        </div>
      );
    }

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
        className="w-full"
          key={currentState}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentState === InteractionState.SCAN_CCCD_REQUEST && (
            <ScanCCCD
              cccdData={cccdData}
              currentRole={currentRole}
              onVerificationComplete={handleVerificationComplete}
              webcamRef={webcamRef}
            />
          )}

          {[
            InteractionState.STUDENT_HAS_SCHEDULE,
            InteractionState.STAFF_HAS_SCHEDULE,
          ].includes(currentState) && MemoizedScheduleSheet}

          {currentState === InteractionState.GUEST && (
            <GuestInteraction
              handleVerificationStart={handleVerificationStart}
              handleScanQRStart={handleScanQRStart}
            />
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  const shouldLoadSchedule = ["STUDENT", "STAFF", "INSTRUCTOR"].includes(
    currentRole
  );

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-sub-text1/10" />
      </div>
    );
  }

  // Main render
  return (
    <div className="flex flex-col gap-6 px-6 py-3 page-restrictions relative overflow-hidden h-screen">
      <div
        className="absolute inset-x-0 bottom-0 -z-10"
        style={{
          backgroundImage: `url(${lavenderWave})`,
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
        <div className="w-1/2 flex flex-col items-center gap-6">
          <Camera />
          {renderInteractionArea()}
        </div>
      </div>
    </div>
  );
};

export default Home;
