import { IWebcamData, ICCCDData } from "../Home/Home";

export interface IWebSocketContext {
  isConnected: boolean;
  webcamData: IWebcamData;
  cccdData: ICCCDData;
  currentRole: string;
  currentCccd: string;
  sendFrame: (frameData: string) => void;
  resetCccdData: () => void;
}

export interface IWebSocketProviderProps {
  children: React.ReactNode;
  webSocketUrl: string;
}
