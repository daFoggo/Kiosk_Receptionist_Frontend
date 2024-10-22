import { ICCCDData } from "../Home/Home";

export interface IContactProps {
  cccdData: ICCCDData | null;
  onContactingComplete: () => void;
  resetCccdData: () => void;
}

export interface IFormData {
  isAppointment: boolean;
  appointmentHour: string;
  appointmentMinute: string;
  department: string;
  phoneNumber: string;
  note: string;
}
