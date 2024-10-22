import { ICCCDData } from "../Home/Home";

interface IScanCCCDProps {
  cccdData: ICCCDData;
  currentRole: string;
  onVerificationComplete: () => void;
  webcamRef: React.RefObject<Webcam>;
}