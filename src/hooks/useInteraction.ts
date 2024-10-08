import { useState, useEffect, useCallback, useRef } from "react";
import interactionConfig from "../sampleData/interactionConfig.json";
import { Course } from "@/components/StudentCalendar";
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
  schedule?: Course[];
  eventData?: Event;
  resetCccdData: () => void
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
  schedule,
  eventData,
  resetCccdData
}: UseInteractionProps): InteractionContextType => {
  const [currentState, setCurrentState] = useState<InteractionState>(
    InteractionState.IDLE
  );
  const [message, setMessage] = useState(interactionConfig.states.IDLE.message);
  const [videoPath, setVideoPath] = useState(
    interactionConfig.states.IDLE.videoPath
  );
  const [isScanning, setIsScanning] = useState(false);
  const [isContacting, setIsContacting] = useState(false);
  const [fixedRole, setFixedRole] = useState<string | null>(null);

  const lastTransitionTimeRef = useRef<number>(Date.now());
  const transitionTimeoutRef = useRef<NodeJS.Timeout>();
  const roleTimeoutRef = useRef<NodeJS.Timeout>();
  const TRANSITION_COOLDOWN = 2000;
  const ROLE_FIXATION_TIME = 3000;

  // filter lich ngay hom nay
  const getTodaySchedule = useCallback((schedule: Course[]): string[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCourses = schedule.filter((course) => {
      const [, datePart] = course.startTime.split(" ");
      const [day, month, year] = datePart.split("/");
      const courseDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day)
      );
      courseDate.setHours(0, 0, 0, 0);
      return courseDate.getTime() === today.getTime();
    });

    return [...new Set(todayCourses.map((course) => course.courseName))];
  }, []);

  // kiem tra xem event co phai la hom nay khong
  const isEventToday = useCallback((event: Event): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(event.start_time);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() === today.getTime();
  }, []);

  // format message cho event
  const formatEventMessage = useCallback((event: Event): string => {
    const startTime = new Date(event.start_time).toLocaleTimeString();
    const endTime = new Date(event.end_time).toLocaleTimeString();
    return `${event.name} diễn ra tại ${event.location} từ ${startTime} đến ${endTime}`;
  }, []);

  // update thong tin tuy theo state moi
  const updateStateConfig = useCallback(
    (newState: InteractionState) => {
      const stateConfig = interactionConfig.states[newState];

      if (newState === InteractionState.STUDENT && schedule) {
        const todaySchedule = getTodaySchedule(schedule);
        if (todaySchedule.length > 0 && "hasSchedule" in stateConfig) {
          setMessage(
            stateConfig.hasSchedule.message + todaySchedule.join(", ")
          );
          // setVideoPath(stateConfig.hasSchedule.videoPath);
        } else if (todaySchedule.length === 0 && "noSchedule" in stateConfig) {
          setMessage(stateConfig.noSchedule.message);
          // setVideoPath(stateConfig.noSchedule.videoPath);
        } else if ("noData" in stateConfig) {
          setMessage(stateConfig.noData.message);
          // setVideoPath(stateConfig.noData.videoPath);
        }
      } else if (newState === InteractionState.STAFF && schedule) {
        const todaySchedule = getTodaySchedule(schedule);
        if (todaySchedule.length > 0 && "hasSchedule" in stateConfig) {
          setMessage(
            stateConfig.hasSchedule.message + todaySchedule.join(", ")
          );
          // setVideoPath(stateConfig.hasSchedule.videoPath);
        } else if (todaySchedule.length === 0 && "noSchedule" in stateConfig) {
          setMessage(stateConfig.noSchedule.message);
          // setVideoPath(stateConfig.noSchedule.videoPath);
        } else if ("noData" in stateConfig) {
          setMessage(stateConfig.noData.message);
          // setVideoPath(stateConfig.noData.videoPath);
        }
      } else if (newState === InteractionState.EVENT_GUEST) {
        if (eventData && isEventToday(eventData) && "hasEvent" in stateConfig) {
          setMessage(
            stateConfig.hasEvent.message + formatEventMessage(eventData)
          );
          // setVideoPath(stateConfig.hasEvent.videoPath);
        } else if ("noEvent" in stateConfig) {
          setMessage(stateConfig.noEvent.message);
          // setVideoPath(stateConfig.noEvent.videoPath);
        }
      } else if ("message" in stateConfig) {
        setMessage(stateConfig.message);
        // setVideoPath(stateConfig.videoPath);
      }

      setIsScanning(newState === InteractionState.GUEST_VERIFICATION);
      setIsContacting(newState === InteractionState.CONTACT_DEPARTMENT);
    },
    [schedule, eventData, getTodaySchedule, isEventToday, formatEventMessage]
  );

  // xu ly chuyen state
  const transitionToState = useCallback(
    (newState: InteractionState) => {
      const now = Date.now();
      if (now - lastTransitionTimeRef.current < TRANSITION_COOLDOWN) {
        console.log("Transition blocked: cooldown period");
        return;
      }

      setCurrentState((prevState) => {
        if (prevState === newState) {
          console.log("Transition blocked: same state");
          return prevState;
        }

        if (
          newState === InteractionState.IDLE &&
          webcamData.nums_of_people > 0
        ) {
          console.log("Transition blocked: people still present");
          return prevState;
        }

        console.log(`Transitioning from ${prevState} to ${newState}`);
        lastTransitionTimeRef.current = now;
        updateStateConfig(newState);
        return newState;
      });
    },
    [webcamData.nums_of_people, updateStateConfig]
  );

  // xu ly chuyen state tu webcam data va role
  useEffect(() => {
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    if (roleTimeoutRef.current) {
      clearTimeout(roleTimeoutRef.current);
    }

    if (webcamData.nums_of_people === 0) {
      transitionToState(InteractionState.IDLE);
      setFixedRole(null);
      resetCccdData();
    } else if (currentRole && !fixedRole) {
      roleTimeoutRef.current = setTimeout(() => {
        setFixedRole(currentRole);
      }, ROLE_FIXATION_TIME);
    }

    transitionTimeoutRef.current = setTimeout(() => {
      if (webcamData.nums_of_people > 0) {
        const roleToUse = fixedRole || currentRole;
        if (roleToUse) {
          const roleStateMap = {
            STUDENT: InteractionState.STUDENT,
            STAFF: InteractionState.STAFF,
            EVENT_GUEST: InteractionState.EVENT_GUEST,
          };
          const nextState =
            roleStateMap[roleToUse.toUpperCase() as keyof typeof roleStateMap];
          if (nextState) {
            transitionToState(nextState);
          } else {
            transitionToState(InteractionState.GREETING);
          }
        } else {
          transitionToState(InteractionState.GREETING);
        }
      }
    }, 1000);

    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      if (roleTimeoutRef.current) {
        clearTimeout(roleTimeoutRef.current);
      }
    };
  }, [webcamData.nums_of_people, currentRole, fixedRole, transitionToState]);

  return {
    message,
    videoPath,
    currentState,
    isScanning,
    isContacting,
    transitionToState,
    
  };
};
