import { InteractionState } from "@/models/InteractionContext/InteractionContext";

export function getInitialStateForRole(role: string): InteractionState {
  switch (role.toUpperCase()) {
    case "STUDENT":
      return InteractionState.STUDENT_HAS_SCHEDULE;
    case "STAFF":
      return InteractionState.STAFF_HAS_SCHEDULE;
    case "INSTRUCTOR":
      return InteractionState.INSTRUCTOR_HAS_SCHEDULE;
    case "GUEST":
      return InteractionState.GUEST;
    default:
      return InteractionState.IDLE;
  }
}

export function getScheduleStateForRole(
  role: string,
  hasSchedule: boolean,
  hasData: boolean
): InteractionState {
  if (!hasData) {
    switch (role.toUpperCase()) {
      case "STUDENT":
        return InteractionState.STUDENT_NO_DATA;
      case "STAFF":
        return InteractionState.STAFF_NO_DATA;
      case "INSTRUCTOR":
        return InteractionState.INSTRUCTOR_NO_DATA;
      default:
        return InteractionState.ERROR;
    }
  }

  if (!hasSchedule) {
    switch (role.toUpperCase()) {
      case "STUDENT":
        return InteractionState.STUDENT_NO_SCHEDULE;
      case "STAFF":
        return InteractionState.STAFF_NO_SCHEDULE;
      case "INSTRUCTOR":
        return InteractionState.INSTRUCTOR_NO_SCHEDULE;
      default:
        return InteractionState.ERROR;
    }
  }

  switch (role.toUpperCase()) {
    case "STUDENT":
      return InteractionState.STUDENT_HAS_SCHEDULE;
    case "STAFF":
      return InteractionState.STAFF_HAS_SCHEDULE;
    case "INSTRUCTOR":
      return InteractionState.INSTRUCTOR_HAS_SCHEDULE;
    default:
      return InteractionState.ERROR;
  }
}
