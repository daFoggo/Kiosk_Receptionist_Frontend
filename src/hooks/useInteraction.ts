import { useState, useEffect, useCallback, useRef } from "react";
import interactionConfig from "@/sample_data/interactionConfig.json";
import { ICourse } from "@/models/StudentCalendar/StudentCalendar";
import {
  InteractionContextType,
  IUseInteractionProps,
  IEvent,
} from "@/models/Home/Home";

export enum InteractionState {
  IDLE = "IDLE",
  GREETING = "GREETING",
  GUEST_VERIFICATION = "GUEST_VERIFICATION",
  CONTACT_DEPARTMENT = "CONTACT_DEPARTMENT",
  EVENT_GUEST = "EVENT_GUEST",
  STUDENT = "STUDENT",
  STAFF = "STAFF",
}

export const useInteraction = ({
  webcamData,
  currentRole,
  schedule,
  eventData,
  resetCccdData,
}: IUseInteractionProps): InteractionContextType => {
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
  const roleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTransitionTimeRef = useRef<number>(0);
  const peopleCountTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const TRANSITION_COOLDOWN = 2000;
  const ROLE_FIX_DELAY = 3000;
  const PEOPLE_COUNT_DELAY = 500;

  // dem thoi gian co dinh role
  const startRoleTimer = useCallback((role: string) => {
    if (roleTimerRef.current) {
      clearTimeout(roleTimerRef.current);
    }
    roleTimerRef.current = setTimeout(() => {
      setFixedRole(role);
    }, ROLE_FIX_DELAY);
  }, []);

  // clear thoi gian
  const clearRoleTimer = useCallback(() => {
    if (roleTimerRef.current) {
      clearTimeout(roleTimerRef.current);
      roleTimerRef.current = null;
    }
  }, []);

  const getTodaySchedule = useCallback((schedule: ICourse[]): string[] => {
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

  const isEventToday = useCallback((event: IEvent): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(event.start_time);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() === today.getTime();
  }, []);

  const formatEventMessage = useCallback((event: IEvent): string => {
    const startTime = new Date(event.start_time).toLocaleTimeString();
    const endTime = new Date(event.end_time).toLocaleTimeString();
    return `${event.name} diễn ra tại ${event.location} từ ${startTime} đến ${endTime}`;
  }, []);

  // update data tuy theo state
  const updateStateConfig = useCallback(
    (newState: InteractionState) => {
      const stateConfig = interactionConfig.states[newState];

      if (newState === InteractionState.STUDENT && schedule) {
        const todaySchedule = getTodaySchedule(schedule);
        if (todaySchedule.length > 0 && "hasSchedule" in stateConfig) {
          setMessage(
            stateConfig.hasSchedule.message + todaySchedule.join(", ")
          );
          setVideoPath(stateConfig.hasSchedule.videoPath);
        } else if (todaySchedule.length === 0 && "noSchedule" in stateConfig) {
          setMessage(stateConfig.noSchedule.message);
          setVideoPath(stateConfig.noSchedule.videoPath);
        } else if ("noData" in stateConfig) {
          setMessage(stateConfig.noData.message);
          setVideoPath(stateConfig.noData.videoPath);
        }
      } else if (newState === InteractionState.STAFF && schedule) {
        const todaySchedule = getTodaySchedule(schedule);
        if (todaySchedule.length > 0 && "hasSchedule" in stateConfig) {
          setMessage(
            stateConfig.hasSchedule.message + todaySchedule.join(", ")
          );
          setVideoPath(stateConfig.hasSchedule.videoPath);
        } else if (todaySchedule.length === 0 && "noSchedule" in stateConfig) {
          setMessage(stateConfig.noSchedule.message);
          setVideoPath(stateConfig.noSchedule.videoPath);
        } else if ("noData" in stateConfig) {
          setMessage(stateConfig.noData.message);
          setVideoPath(stateConfig.noData.videoPath);
        }
      } else if (newState === InteractionState.EVENT_GUEST) {
        if (eventData && isEventToday(eventData) && "hasEvent" in stateConfig) {
          setMessage(
            stateConfig.hasEvent.message + formatEventMessage(eventData)
          );
          setVideoPath(stateConfig.hasEvent.videoPath);
        } else if ("noEvent" in stateConfig) {
          setMessage(stateConfig.noEvent.message);
          setVideoPath(stateConfig.noEvent.videoPath);
        }
      } else if ("message" in stateConfig) {
        setMessage(stateConfig.message);
        setVideoPath(stateConfig.videoPath);
      }

      setIsScanning(newState === InteractionState.GUEST_VERIFICATION);
      setIsContacting(newState === InteractionState.CONTACT_DEPARTMENT);
    },
    [schedule, eventData, getTodaySchedule, isEventToday, formatEventMessage]
  );

  // chuyen trang thai
  const transitionToState = useCallback(
    (newState: InteractionState) => {
      if (isScanning && newState !== InteractionState.IDLE) {
        return;
      }

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

  // luong thay doi trang thai
  useEffect(() => {
    if (webcamData.nums_of_people > 0 && currentRole) {
      if (currentRole !== fixedRole) {
        startRoleTimer(currentRole);
      }
    } else {
      clearRoleTimer();
      setFixedRole(null);
    }
  }, [
    webcamData.nums_of_people,
    currentRole,
    fixedRole,
    startRoleTimer,
    clearRoleTimer,
  ]);

  useEffect(() => {
    if (webcamData.nums_of_people > 0) {
      const roleToUse = fixedRole || currentRole;
      if (roleToUse) {
        let nextState;
        if (roleToUse === "STUDENT") {
          nextState = InteractionState.STUDENT;
        } else if (roleToUse === "STAFF") {
          nextState = InteractionState.STAFF;
        } else if (roleToUse === "EVENT_GUEST") {
          nextState = InteractionState.EVENT_GUEST;
        }

        if (nextState) {
          transitionToState(nextState);
        } else {
          transitionToState(InteractionState.GREETING);
        }
      } else {
        transitionToState(InteractionState.GREETING);
      }
    } else {
      // Reset logic when no people are detected
      if (peopleCountTimeoutRef.current) {
        clearTimeout(peopleCountTimeoutRef.current);
      }
      peopleCountTimeoutRef.current = setTimeout(() => {
        transitionToState(InteractionState.IDLE);
        setFixedRole(null);
        clearRoleTimer();
        resetCccdData();
      }, PEOPLE_COUNT_DELAY);
    }

    return () => {
      if (peopleCountTimeoutRef.current) {
        clearTimeout(peopleCountTimeoutRef.current);
      }
    };
  }, [
    webcamData.nums_of_people,
    currentRole,
    fixedRole,
    transitionToState,
    clearRoleTimer,
    resetCccdData,
  ]);

  return {
    message,
    videoPath,
    currentState,
    isScanning,
    isContacting,
    transitionToState,
  };
};
