import { useState, useEffect } from "react";
import interactionConfig from "../sampleData/interactionConfig.json";

export enum InteractionState {
  IDLE = "IDLE",
  GREETING = "GREETING",
  ROLE_SELECTION = "ROLE_SELECTION",
  GUEST_VERIFICATION = "GUEST_VERIFICATION",
  CONTACT_DEPARTMENT = "CONTACT_DEPARTMENT",
  EVENT_GUEST = "EVENT_GUEST",
  STUDENT = "STUDENT",
  STAFF = "STAFF",
}

interface WebcamData {
  nums_of_people: number;
  person_datas: Array<{
    role?: string;
  }>;
}

interface UseInteractionProps {
  webcamData: WebcamData;
  currentRole: string;
}

interface InteractionContextType {
  message: string;
  videoPath: string;
  currentState: InteractionState;
  selectionOptions: any | null;
  isScanning: boolean;
  isContacting: boolean;
  handleRoleSelection: (role: string) => void;
  transitionToState: (newState: InteractionState) => void;
}

export const useInteraction = ({
  webcamData,
  currentRole,
}: UseInteractionProps): InteractionContextType => {
  const [currentState, setCurrentState] = useState<InteractionState>(
    InteractionState.IDLE
  );
  const [consecutiveFramesWithPeople, setConsecutiveFramesWithPeople] =
    useState(0);
  const [message, setMessage] = useState(interactionConfig.states.IDLE.message);
  const [videoPath, setVideoPath] = useState(
    interactionConfig.states.IDLE.videoPath
  );
  const [isScanning, setIsScanning] = useState(false);
  const [isContacting, setIsContacting] = useState(false);

  useEffect(() => {
    // neu webcam co nhan dien duoc nguoi
    if (webcamData.nums_of_people > 0) {
      setConsecutiveFramesWithPeople((prev) => prev + 1);
      // neu so frame nhan dien duoc nguoi lien tuc lon hon 3 va trang thai hien tai la IDLE -> chuyen trang thai sang GREETING
      if (
        consecutiveFramesWithPeople >= 3 &&
        currentState === InteractionState.IDLE
      ) {
        transitionToState(InteractionState.GREETING);
      }
    }

    // neu khong thi reset lai so frame lien tuc nhan dien duoc nguoi va chuyen trang thai ve IDLE
    else {
      setConsecutiveFramesWithPeople(0);
      if (currentState !== InteractionState.IDLE) {
        resetInteraction();
      }
    }
  }, [webcamData.nums_of_people]);

  // neu co role va trang thai hien tai la GREETING -> xu ly role
  useEffect(() => {
    if (currentRole && currentState === InteractionState.GREETING) {
      handleRoleDetection(currentRole);
    }
  }, [currentRole]);

  // chuyen trang thai
  const transitionToState = (newState: InteractionState) => {
    setCurrentState(newState);
    const stateConfig = interactionConfig.states[newState];

    if ("message" in stateConfig) {
      setMessage(stateConfig.message);
      setVideoPath(stateConfig.videoPath);
    }

    // neu trang thai la GUEST_VERIFICATION -> bat dau thuc hien quet CCCD
    if (newState === InteractionState.GUEST_VERIFICATION) {
      setIsScanning(true);
    }
    // neu trang thai la CONTACT_DEPARTMENT -> bat dau thuc hien lien he
    else if (newState === InteractionState.CONTACT_DEPARTMENT) {
      setIsContacting(true);
    }
  };

  // xu ly role
  const handleRoleDetection = (role: string) => {
    const roleMap = {
      GUEST: InteractionState.GUEST_VERIFICATION,
      EVENT_GUEST: InteractionState.EVENT_GUEST,
      STUDENT: InteractionState.STUDENT,
      STAFF: InteractionState.STAFF,
    };

    const nextState = roleMap[role.toUpperCase() as keyof typeof roleMap];
    if (nextState) {
      transitionToState(nextState);
    } else {
      transitionToState(InteractionState.ROLE_SELECTION);
    }
  };

  // xu ly lua chon role
  const handleRoleSelection = (selectedRole: string) => {
    const option = interactionConfig.states.ROLE_SELECTION.options.choices.find(
      (opt: any) => opt.value === selectedRole
    );
    if (option) {
      transitionToState(option.nextState as InteractionState);
    }
  };

  // reset ve idle
  const resetInteraction = () => {
    setCurrentState(InteractionState.IDLE);
    setMessage(interactionConfig.states.IDLE.message);
    setVideoPath(interactionConfig.states.IDLE.videoPath);
    setIsScanning(false);
  };

  return {
    message,
    videoPath,
    currentState,
    selectionOptions:
      currentState === InteractionState.ROLE_SELECTION
        ? interactionConfig.states.ROLE_SELECTION.options
        : null,
    isScanning,
    isContacting,
    handleRoleSelection,
    transitionToState,
  };
};
