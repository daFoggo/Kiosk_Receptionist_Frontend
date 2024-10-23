export interface IInteractionState {
  message: string;
  videoPath: string;
}

export interface IInteractionContextState {
  currentState: InteractionState;
  message: string;
  videoPath: string;
  transitionTo: (newState: InteractionState) => void;
}

export interface IInteractionProviderProps {
  children: React.ReactNode;
}

export enum InteractionState {
  IDLE = 'idle',
  
  // Guest states
  GUEST = 'guest',
  SCAN_QR_REQUEST = 'scan_qr_request',
  SCAN_QR_INFO = 'scan_qr_info',
  SCAN_QR_SUCCESS = 'scan_qr_success',
  SCAN_QR_FAIL = 'scan_qr_fail',
  SCAN_CCCD_REQUEST = 'scan_cccd_request',
  SCAN_CCCD_SUCCESS = 'scan_cccd_success',
  SCAN_CCCD_FAIL = 'scan_cccd_fail',
  APPOINTMENT_SELECT_REQUEST = 'appointment_select_request',
  APPOINTMENT_SELECT_SUCCESS = 'appointment_select_success',
  
  // Student states
  STUDENT_HAS_SCHEDULE = 'student_has_schedule',
  STUDENT_NO_SCHEDULE = 'student_no_schedule',
  STUDENT_NO_DATA = 'student_no_data',
  
  // Staff states
  STAFF_HAS_SCHEDULE = 'staff_has_schedule',
  STAFF_NO_SCHEDULE = 'staff_no_schedule',
  STAFF_NO_DATA = 'staff_no_data',
  
  // Instructor states
  INSTRUCTOR_HAS_SCHEDULE = 'instructor_has_schedule',
  INSTRUCTOR_NO_SCHEDULE = 'instructor_no_schedule',
  INSTRUCTOR_NO_DATA = 'instructor_no_data',
  
  // Error state
  ERROR = 'error'
}