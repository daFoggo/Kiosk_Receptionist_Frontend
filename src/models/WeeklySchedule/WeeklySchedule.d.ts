export interface IWork {
    name: string;
    attendees: string;
    preparation?: string;
    location: string;
    iso_datetime: Date;
  }
  
  export interface IWeeklyScheduleProps {
    works: Work[];
  }
  