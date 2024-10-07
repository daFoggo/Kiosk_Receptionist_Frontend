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
  const [currentState, setCurrentState] = useState<InteractionState>(InteractionState.IDLE);
  const [message, setMessage] = useState(interactionConfig.states.IDLE.message);
  const [videoPath, setVideoPath] = useState(interactionConfig.states.IDLE.videoPath);
  const [isScanning, setIsScanning] = useState(false);
  const [isContacting, setIsContacting] = useState(false);

  const lastTransitionTimeRef = useRef<number>(Date.now());
  const transitionTimeoutRef = useRef<NodeJS.Timeout>();
  const TRANSITION_COOLDOWN = 2000;

  // filter lich ngay hom nay
  const getTodaySchedule = useCallback((schedule: Course[]): string[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCourses = schedule.filter((course) => {
      const [, datePart] = course.startTime.split(" ");
      const [day, month, year] = datePart.split("/");
      const courseDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
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
  const updateStateConfig = useCallback((newState: InteractionState) => {
    const stateConfig = interactionConfig.states[newState];

    if (newState === InteractionState.STUDENT && studentSchedule) {
      const todaySchedule = getTodaySchedule(studentSchedule);
      if (todaySchedule.length > 0 && "hasSchedule" in stateConfig) {
        setMessage(stateConfig.hasSchedule.message + todaySchedule.join(", "));
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
        setMessage(stateConfig.hasEvent.message + formatEventMessage(eventData));
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
  }, [studentSchedule, eventData, getTodaySchedule, isEventToday, formatEventMessage]);

  // xu ly chuyen state
  const transitionToState = useCallback((newState: InteractionState) => {
    const now = Date.now();
    if (now - lastTransitionTimeRef.current < TRANSITION_COOLDOWN) {
      console.log('Transition blocked: cooldown period');
      return;
    }

    // toi uu chuyen state
    setCurrentState((prevState) => {
      // block neu state truoc = state sau
      if (prevState === newState) {
        console.log('Transition blocked: same state');
        return prevState;
      }

      // block neu state idle ma van con nguoi
      if (newState === InteractionState.IDLE && webcamData.nums_of_people > 0) {
        console.log('Transition blocked: people still present');
        return prevState;
      }

      // block neu state idle ma van con role
      console.log(`Transitioning from ${prevState} to ${newState}`);
      lastTransitionTimeRef.current = now;
      updateStateConfig(newState);
      return newState;
    });
  }, [webcamData.nums_of_people, updateStateConfig]);

  // xu ly chuyen state tu webcam data va role
  useEffect(() => {
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    transitionTimeoutRef.current = setTimeout(() => {
      if (webcamData.nums_of_people === 0) {
        transitionToState(InteractionState.IDLE);
      } else if (currentRole && currentRole !== currentState) {
        const roleStateMap = {
          STUDENT: InteractionState.STUDENT,
          STAFF: InteractionState.STAFF,
          EVENT_GUEST: InteractionState.EVENT_GUEST,
          GUEST: InteractionState.GUEST_VERIFICATION,
        };
        
        const nextState = roleStateMap[currentRole.toUpperCase() as keyof typeof roleStateMap];
        if (nextState) {
          transitionToState(nextState);
        } else {
          transitionToState(InteractionState.GREETING);
        }
      }
    }, 1000);

    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [webcamData.nums_of_people, currentRole, currentState, transitionToState]);

  return {
    message,
    videoPath,
    currentState,
    isScanning,
    isContacting,
    transitionToState,
  };
};