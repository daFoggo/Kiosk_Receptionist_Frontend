import { useState, useEffect, useCallback } from "react";
import interactionConfig from "../sampleData/interactionConfig.json";
import { Course } from "@/pages/StudentCalendar";
import { Event } from "@/components/EventBanner";
export enum InteractionState {
  IDLE = "IDLE",
  GREETING = "GREETING",
  GUEST_VERIFICATION = "GUEST_VERIFICATION",
  CONTACT_DEPARTMENT = "CONTACT_DEPARTMENT",
  EVENT_GUEST = "EVENT_GUEST",
  STUDENT = "STUDENT",
  STAFF = "STAFF",
}

export enum Role {
  GUEST = "GUEST",
  EVENT_GUEST = "EVENT_GUEST",
  STUDENT = "STUDENT",
  STAFF = "STAFF",
}

interface WebcamData {
  nums_of_people: number;
  person_datas: Array<{
    name?: string;
    role?: string;
  }>;
}

interface UseInteractionProps {
  webcamData: WebcamData;
  currentRole: string;
  studentSchedule?: Course[];
  eventData?: Event;
}

interface InteractionContextType {
  message: string;
  videoPath: string;
  currentState: InteractionState;
  isScanning: boolean;
  isContacting: boolean;
  transitionToState: (newState: InteractionState) => void;
}

export const useInteraction = ({
  webcamData,
  currentRole,
  studentSchedule,
  eventData,
}: UseInteractionProps): InteractionContextType => {
  const [currentState, setCurrentState] = useState<InteractionState>(
    InteractionState.IDLE
  );
  const [consecutiveTimeWithPeople, setConsecutiveTimeWithPeople] = useState(0);
  const [message, setMessage] = useState(interactionConfig.states.IDLE.message);
  const [videoPath, setVideoPath] = useState(
    interactionConfig.states.IDLE.videoPath
  );
  const [isScanning, setIsScanning] = useState(false);
  const [isContacting, setIsContacting] = useState(false);

  // lay data lich trong hom nay
  const getTodaySchedule = useCallback((schedule: Course[]): string[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCourses = schedule.filter((course) => {
      const [time, datePart] = course.startTime.split(" ");
      const [day, month, year] = datePart.split("/");
      const courseDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day)
      );
      courseDate.setHours(0, 0, 0, 0);

      return courseDate.getTime() === today.getTime();
    });

    const uniqueCourses = [
      ...new Set(todayCourses.map((course) => course.courseName)),
    ];

    return uniqueCourses;
  }, []);

  const isEventToday = useCallback((event: Event): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const eventDate = new Date(event.start_time);
    eventDate.setHours(0, 0, 0, 0);
    
    return eventDate.getTime() === today.getTime();
  }, []);

  // Format event for display
  const formatEventMessage = useCallback((event: Event): string => {
    const startTime = new Date(event.start_time).toLocaleTimeString();
    const endTime = new Date(event.end_time).toLocaleTimeString();
    return `Ngày hôm nay có sự kiện ${event.name} diễn ra tại ${event.location} từ ${startTime} đến ${endTime}`;
  }, []);

  // chuyen trang thai
  const transitionToState = useCallback(
    (newState: InteractionState) => {
      setCurrentState(newState);
      const stateConfig = interactionConfig.states[newState];

      if (newState === InteractionState.STUDENT) {
        const todaySchedule = getTodaySchedule(studentSchedule || []);
        if (todaySchedule.length > 0 && "hasSchedule" in stateConfig) {
          const scheduleString = todaySchedule.join(", ");
          setMessage(stateConfig.hasSchedule.message + scheduleString);
          setVideoPath(stateConfig.hasSchedule.videoPath);
        } else if (todaySchedule.length === 0 && "hasSchedule" in stateConfig) {
          setMessage(stateConfig.noSchedule.message);
          setVideoPath(stateConfig.noSchedule.videoPath);
        } else if ("noData" in stateConfig) {
          setMessage(stateConfig.noData.message);
          setVideoPath(stateConfig.noData.videoPath);
        }
      } else if (newState === InteractionState.EVENT_GUEST) {
        if (eventData && isEventToday(eventData) && "hasEvent" in stateConfig) {
          const eventMessage = formatEventMessage(eventData);
          setMessage(stateConfig.hasEvent.message + eventMessage);
          setVideoPath(stateConfig.hasEvent.videoPath);
        } else if ("noEvent" in stateConfig) {
          setMessage(stateConfig.noEvent.message);
          setVideoPath(stateConfig.noEvent.videoPath);
        }
      } else if ("message" in stateConfig) {
        setMessage(stateConfig.message);
        setVideoPath(stateConfig.videoPath);
      }

      if (newState === InteractionState.GUEST_VERIFICATION) {
        setIsScanning(true);
      } else if (newState === InteractionState.CONTACT_DEPARTMENT) {
        setIsContacting(true);
      }
    },
    [studentSchedule, eventData]
  );

  const handleRoleDetection = useCallback(
    (role: string) => {
      const roleMap = {
        GUEST: InteractionState.GUEST_VERIFICATION,
        EVENT_GUEST: InteractionState.EVENT_GUEST,
        STUDENT: InteractionState.STUDENT,
        STAFF: InteractionState.STAFF,
      };

      const nextState = roleMap[role.toUpperCase() as keyof typeof roleMap];
      if (nextState) {
        setTimeout(() => {
          transitionToState(nextState);
        }, 3000);
      }
    },
    [transitionToState]
  );

  const resetInteraction = useCallback(() => {
    setCurrentState(InteractionState.IDLE);
    setMessage(interactionConfig.states.IDLE.message);
    setVideoPath(interactionConfig.states.IDLE.videoPath);
    setIsScanning(false);
    setIsContacting(false);
  }, []);

  useEffect(() => {
    const detectionInterval = 1000;

    let timer: NodeJS.Timeout | null = null;
    if (webcamData?.nums_of_people > 0) {
      if (!timer) {
        timer = setInterval(() => {
          setConsecutiveTimeWithPeople((prev) => prev + 1);
        }, detectionInterval);
      }

      if (
        consecutiveTimeWithPeople >= 1 &&
        currentState === InteractionState.IDLE
      ) {
        transitionToState(InteractionState.GREETING);
      }
    } else {
      setConsecutiveTimeWithPeople(0);
      if (timer) {
        clearInterval(timer);
        timer = null;
      }

      if (currentState !== InteractionState.IDLE) {
        resetInteraction();
      }
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [
    webcamData.nums_of_people,
    consecutiveTimeWithPeople,
    currentState,
    transitionToState,
    resetInteraction,
  ]);

  useEffect(() => {
    if (currentRole && currentState === InteractionState.GREETING) {
      handleRoleDetection(currentRole);
    }
  }, [currentRole, currentState, handleRoleDetection]);

  return {
    message,
    videoPath,
    currentState,
    isScanning,
    isContacting,
    transitionToState,
  };
};
