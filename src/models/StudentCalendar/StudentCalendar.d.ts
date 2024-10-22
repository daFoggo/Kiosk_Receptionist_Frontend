export interface ICourse {
  eventType: string;
  creditClass: string;
  courseName: string;
  startTime: string;
  endTime: string;
  room: string;
  instructor: string;
}

export interface IStudentCalendarProps {
  calendarData: ICourse[];
  onWeekChange: (startDate: Date) => void;
  isLoading: boolean;
}
