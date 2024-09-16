import { ChatMockData } from "../types/ChatMockData"

export const chatMockData: ChatMockData[] = [
    {
        id: 1,
        initialMessage: "Chào mừng quý khách đến với Viện khoa Học kỹ thuật Bưu điện",
        video_path: "src/assets/videos/1.mp4",
        select: {
            question: "Quý khách là?",
            video_path: "src/assets/videos/2.mp4",
            options: [
                { label: "Sinh viên", value: "sinhVien" },
                { label: "Khách mời sự kiện", value: "khachMoi" },
                { label: "Cán bộ viện", value: "canBo" },
                { label: "Khách", value: "khach", extraFlow: "cccd"}
            ]
        },
        response: {
            sinhVien: "Chào bạn. Ngày hôm nay sinh viên có lịch học môn Triết học Mác Lenin và Kỹ năng tạo lập văn bản tại Tầng 5. Chúc bạn một ngày học tập vui vẻ và hiệu quả.",
            khachMoi: "Chào quý khách. Sự kiện lễ kỉ niệm 58 năm ngày thành lập Viện Khoa học Kỹ thuật Bưu điện sẽ tổ chức tại Hội trường 2, Tầng 2 ngày 17/9/2024. Rất hân hạnh được đón tiếp quý khách",
            canBo: "Chào bạn. Chúc bạn có một ngày làm việc hiệu quả.",
            khach: "Chào quý khách. Quý khách vui lòng xuất trình căn cước công dân qua máy đọc để đăng ký thông tin",
        },
        response_path : {
            sinhVien: "src/assets/videos/sinhVien.mp4",
            khachMoi: "src/assets/videos/khachMoi.mp4",
            canBo: "src/assets/videos/canBo.mp4",
            khach: "src/assets/videos/khach.mp4",
        }
    }, 
]
