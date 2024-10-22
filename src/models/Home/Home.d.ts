export interface IEvent {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  location: string;
}

export interface IWebcamData {
  nums_of_people: number;
  person_datas: Array<{
    name?: string;
    role?: string;
    cccd?: string;
  }>;
}

export interface IUseInteractionProps {
  webcamData: IWebcamData;
  currentRole: string;
  schedule?: ICourse[];
  eventData?: IEvent;
  resetCccdData: () => void;
}

export interface InteractionContextType {
  message: string;
  videoPath: string;
  currentState: InteractionState;
  isScanning: boolean;
  isContacting: boolean;
  transitionToState: (newState: InteractionState) => void;
}

export interface IUseCCCDVerificationProps {
  webcamData: {
    nums_of_people: number;
    person_datas: Array<{
      role?: string;
    }>;
  };
  currentRole: string;
  resetCccdData: () => void;
  transitionToState: (state: InteractionState) => void;
}

export interface IWebcamData {
  nums_of_people: number;
  person_datas: Array<{
    role?: string;
    cccd?: string;
  }>;
}

export interface ICCCDData {
  [key: string]: string;
}

export interface IUseWebSocketProps {
  webSocketUrl: string;
  cameraRef: React.RefObject<Webcam>;
}

export interface IUseWebSocketReturn {
  isConnected: boolean;
  webcamData: IWebcamData;
  cccdData: ICCCDData;
  currentRole: string;
  currentCccd: string;
  resetCccdData: () => void;
}
