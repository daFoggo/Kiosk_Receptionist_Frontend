import { ICourse } from "../StudentCalendar/StudentCalendar";
export interface IScheduleSheetProps {
    isSheetOpen: boolean;
    setIsSheetOpen: (open: boolean) => void;
    currentRole: string;
    scheduleData: ICourse[];
    getScheduleData: (startDate?: Date) => void;
    isLoading: boolean;
  }
