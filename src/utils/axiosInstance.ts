
import axios, { AxiosInstance } from 'axios';
import { toast } from 'sonner';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_HTTP_IP || 'https://service.ript-kiosk.world/api/',
  maxRedirects: 0,
  validateStatus: function (status) {
    return status >= 200 && status < 300;
  },
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.log("Error response:", error?.response);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 301 || error.response?.status === 302) {
        console.log("HTTPS redirected to HTTP")
        toast.error("Không an toàn: Trang web đang cố chuyển hướng từ HTTPS sang HTTP");
      } else {
        console.log(`Lỗi mạng: ${error.message}`);
        toast.error(`Lỗi mạng: ${error.message}`);
      }
    } else {
      toast.error("Đã xảy ra lỗi không xác định");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;