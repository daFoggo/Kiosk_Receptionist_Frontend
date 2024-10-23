export const convertRole = (role: string) => {
  switch (role) {
    case "GUEST":
      return "Khách";
    case "EVENT_GUEST":
      return "Khách mời sự kiện";
    case "STUDENT":
      return "Sinh viên";
    case "STAFF":
      return "Cán bộ";
    default:
      return "Không xác định";
  }
};
