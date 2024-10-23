export interface ICameraProps {
  webcamData: IWebcamData;
  cameraRef: React.RefObject<Webcam>;
  isConnected: boolean;
}

export interface IPersonData {
  cccd: string;
  name: string;
  role: string;
}
