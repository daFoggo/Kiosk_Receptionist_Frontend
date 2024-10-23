export const MORNING_HOURS = ["08", "09", "10", "11", "12"];
export const AFTERNOON_HOURS = ["13", "14", "15", "16", "17"];
export const MINUTES = ["00", "15", "30", "45"];

export const DEPARTMENTS = [
  { value: "bld", label: "Ban lãnh đạo" },
  { value: "phongTh", label: "Phòng tổng hợp" },
  {
    value: "phongKhcnvkhkd",
    label: "Phòng Khoa học công nghệ và Kế hoạch kinh doanh",
  },
  { value: "phongTvtk", label: "Phòng tư vấn thiết kế" },
  {
    value: "phongNcktvdvvt",
    label: "Phòng nghiên cứu kỹ thuật và dịch vụ viễn thông",
  },
  {
    value: "phongDlkdvtccl",
    label: "Phòng đo lường kiểm định và tiêu chuẩn chất lượng",
  },
  {
    value: "phongUdvcgcns",
    label: "Phòng ứng dụng và chuyển giao công nghệ số",
  },
  { value: "phongNcptcns", label: "Phòng nghiên cứu phát triển công nghệ số" },
];

export const INTERACTIONFLOW = {
  idle: {
    // Khi chưa có người
    message: "",
    videoPath: "src/assets/videos/default.mp4",
  },

  // Role guest
  guest: {
    // Có người vào với vai trò khách
    message: "Chào mừng quý khách đến với Viện khoa học Kỹ thuật Bưu điện.",
    videoPath: "src/assets/videos/guest.mp4",
  },
  scan_qr_request: {
    // Người dùng chọn lựa chọn "Tôi có lịch hẹn"
    message:
      "Quý khách vui lòng đưa mã QR vào gần Camera để xác minh lịch hẹn.",
    videoPath: "src/assets/videos/scan_qr.mp4",
  },
  scan_qr_info: {
    // Sau khi hiên thị thông tin sẽ có nút xác nhận để thực hiện liên hệ
    message: "Quý khách có lịch hẹn với",
    videoPath: "src/assets/videos/scan_qr_info.mp4",
  },
  scan_qr_success: {
    // Sau khi liên hệ thành công
    message:
      "Hệ thống đã gửi thông báo đến bên cần liên hệ. Quý khách vui lòng chờ trong giây lát.",
    videoPath: "src/assets/videos/scan_qr_success.mp4",
  },
  scan_qr_fail: {
    // Khi không tìm thấy thông tin lịch hẹn từ QR
    message:
      "Không tìm thấy thông tin lịch hẹn. Quý khách vui lòng thử lại hoặc liên hệ trực tiếp với bên cần liên hệ.",
    videoPath: "src/assets/videos/scan_qr_fail.mp4",
  },
  scan_cccd_request: {
    // Người dùng chọn lựa chọn "Xác thực thông tin"
    message:
      "Quý khách vui lòng xuất trình Căn cước công dân vào máy đọc bên dưới để xác minh thông tin.",
    videoPath: "src/assets/videos/scan_cccd.mp4",
  },
  scan_cccd_success: {
    // Sau khi xác minh thông tin thành công
    message: "Đã xác minh thành công thông tin của",
    videoPath: "src/assets/videos/scan_cccd_success.mp4",
  },
  scan_cccd_fail: {
    // Khi xác minh thông tin thất bại
    message: "Xác minh thông tin thất bại. Quý khách vui lòng thử lại.",
    videoPath: "src/assets/videos/scan_cccd_fail.mp4",
  },
  appointment_select_request: {
    // Người dùng chọn lựa chọn "Tôi muốn liên hệ" thay vì "Hoàn tất"
    message: "Quý khách vui lòng chọn lịch hẹn muốn liên hệ",
    videoPath: "src/assets/videos/appointment_select.mp4",
  },
  appointment_select_success: {
    // Sau khi chọn lịch hẹn và nhấn xác nhận
    message:
      "Hệ thống đã gửi thông báo đến bên cần liên hệ. Quý khách vui lòng chờ trong giây lát.",
    videoPath: "src/assets/videos/appointment_select_success.mp4",
  },

  // role student
  student_has_schedule: {
    // Khi sinh viên nhấn vào nút "Xem lịch học của tôi"
    message: "Lịch học của bạn hôm nay bao gồm",
    videoPath: "src/assets/videos/student_has_schedule.mp4",
  },
  student_no_schedule: {
    // Khi sinh viên không có lịch học
    message: "Hôm nay bạn không có lịch học nào.",
    videoPath: "src/assets/videos/student_no_schedule.mp4",
  },
  student_no_data: {
    // Khi không tìm thấy dữ liệu lịch học của sinh viên
    message: "Không tìm thấy dữ liệu lịch học của bạn trong CSDL.",
    videoPath: "src/assets/videos/student_no_data.mp4",
  },

  // role staff
  staff_has_schedule: {
    // Khi nhân viên nhấn vào nút "Xem lịch làm việc của tôi"
    message: "Lịch làm việc của bạn hôm nay bao gồm",
    videoPath: "src/assets/videos/staff_has_schedule.mp4",
  },
  staff_no_schedule: {
    // Khi nhân viên không có lịch làm việc
    message: "Hôm nay bạn không có lịch làm việc nào.",
    videoPath: "src/assets/videos/staff_no_schedule.mp4",
  },
  staff_no_data: {
    // Khi không tìm thấy dữ liệu lịch làm việc của nhân viên
    message: "Không tìm thấy dữ liệu lịch làm việc của bạn trong CSDL.",
    videoPath: "src/assets/videos/staff_no_data.mp4",
  },
  
  // role instructor
  instructor_has_schedule: {
    // Khi giảng viên nhấn vào nút "Xem lịch giảng dạy của tôi"
    message: "Lịch giảng dạy của bạn hôm nay bao gồm",
    videoPath: "src/assets/videos/instructor_has_schedule.mp4",
  },
  instructor_no_schedule: {
    // Khi giảng viên không có lịch giảng dạy
    message: "Hôm nay bạn không có lịch giảng dạy nào.",
    videoPath: "src/assets/videos/instructor_no_schedule.mp4",
  },
  instructor_no_data: {
    // Khi không tìm thấy dữ liệu lịch giảng dạy của giảng viên
    message: "Không tìm thấy dữ liệu lịch giảng dạy của bạn trong CSDL.",
    videoPath: "src/assets/videos/instructor_no_data.mp4",
  },

  // error
  error: {
    // Khi có lỗi xảy ra
    message: "Có lỗi xảy ra, vui lòng thử lại sau.",
    videoPath: "src/assets/videos/error.mp4",
  },
};
