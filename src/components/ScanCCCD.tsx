import { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { chatMockData } from "@/sampleData/chatMockData";
import iconCCCD from "../assets/icon/iconCCCD.png";
import { ipUploadData } from "@/utils/ip";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ScanCCCD = ({
  setIsScanning,
  setCurrentMessage,
  cccdData,
  setCurrentVideoPath,
  currentRole,
}: {
  setIsScanning: (value: boolean) => void;
  setCurrentMessage: (value: string) => void;
  cccdData: Record<string, string> | null;
  setCurrentVideoPath: (value: string) => void;
  currentRole: string;
}) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const webcamRef = useRef<Webcam>(null);

  const cccdFields = [
    { key: "Identity Code", label: "Mã số CCCD" },
    { key: "Name", label: "Họ và tên" },
    { key: "DOB", label: "Ngày sinh" },
    { key: "Gender", label: "Giới tính" },
    { key: "Hometown", label: "Quê quán" },
  ];

  useEffect(() => {
    let timer: any;
    if (isConfirmed && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (isConfirmed && countdown === 0) {
      setIsScanning(false);
      setCurrentVideoPath("src/assets/videos/1.mp4");
      setCurrentMessage(
        chatMockData[0]?.response[currentRole] ||
          chatMockData[0]?.initialMessage
      );
    }
    return () => clearTimeout(timer);
  }, [
    isConfirmed,
    countdown,
    setIsScanning,
    setCurrentVideoPath,
    setCurrentMessage,
    chatMockData,
    currentRole,
  ]);

  const captureAndUpload = async () => {
    setIsProcessing(true);
    setProcessProgress(0);

    try {
      const capturedImages = [];
      for (let i = 0; i < 3; i++) {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
          capturedImages.push(imageSrc);
          setProcessProgress((i + 1) * 25);
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      if (capturedImages.length === 3 && cccdData) {
        setProcessProgress(75);

        const formattedData = {
          b64_img: capturedImages,
          cccd: {
            "Identity Code": cccdData["Identity Code"],
            Name: cccdData["Name"],
            DOB: cccdData["DOB"],
            Gender: cccdData["Gender"],
            Hometown: cccdData["Hometown"],
          },
          role: selectedRole,
        };

        const response = await axios.post(ipUploadData, formattedData);
        console.log(response.data);
        setProcessProgress(100);
        toast.success("Đã xác nhận thông tin thành công");

        handleConfirm();
      }
    } catch (error) {
      console.error("Error processing and uploading data:", error);
      toast.error("Có lỗi trong quá trình xác nhận thông tin");
    } finally {
      setIsProcessing(false);
      setIsDialogOpen(false);
    }
  };

  const handleConfirm = () => {
    setCurrentMessage(
      // cccdData
      //   ? `Cảm ơn ${cccdData?.Gender === "Nam" ? "ông" : "bà"} ${
      //       cccdData?.Name
      //     } đã xác nhận thông tin`
      //   : 
        "Cảm ơn quý khách đã xác nhận thông tin"
    );
    setCurrentVideoPath("src/assets/videos/quetCCCD.mp4");
    setIsConfirmed(true);
    setCountdown(5);
  };

  const isDataComplete =
    cccdData && cccdFields.every((field) => cccdData[field.key]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto font-sans">
      <div className="w-full aspect-video relative">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-full h-full object-cover rounded-3xl"
          mirrored
          screenshotQuality={1}
        />
      </div>
      <Card className="w-full rounded-2xl border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <img src={iconCCCD} alt="" className="w-24 bg-base rounded-2xl p-2" />
          <h1 className="text-xl font-semibold text-justify">
            Quý khách vui lòng đưa Căn cước công dân vào khe máy đọc bên dưới
          </h1>
        </CardHeader>
      </Card>

      <Card className="w-full rounded-2xl border shadow-sm ">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-heading">
            Thông tin
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div
            key="role"
            className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 w-full"
          >
            <Label
              htmlFor="role"
              className="text-right font-semibold text-xl md:col-span-1"
            >
              Vai trò
            </Label>
            <Select value={selectedRole} onValueChange={setSelectedRole} required>
              <SelectTrigger className="md:col-span-2 bg-crust text-base-content">
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sinhVien">Sinh viên</SelectItem>
                <SelectItem value="canBo">Cán bộ</SelectItem>
                <SelectItem value="khach">Khách</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {cccdFields.map((field) => (
            <div
              key={field.key}
              className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 w-full"
            >
              <Label
                htmlFor={field.key}
                className="text-right font-semibold text-xl md:col-span-1"
              >
                {field.label}
              </Label>
              <Input
                id={field.key}
                className="md:col-span-2 bg-crust text-base-content focus:ring-2 focus:ring-primary"
                value={cccdData?.[field.key] || ""}
                placeholder=""
                readOnly
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex items-center gap-4 w-full">
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="default"
              disabled={selectedRole === "" || !isDataComplete || isConfirmed || isProcessing}
              className="w-full bg-lavender text-white font-semibold hover:bg-lavender/90 py-6 px-8 text-xl border shadow-sm rounded-xl"
              onClick={() => setIsDialogOpen(true)}
            >
              {isProcessing
                ? `Đang xử lý thông tin ${processProgress}%`
                : isConfirmed
                ? `Đang trở về ${countdown}s`
                : "Xác nhận"}
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-heading text-3xl font-bold border-b-2 pb-4">
                Lưu ý
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription className="text-2xl font-semibold text-sub-text1">
              Sau khi nhấn xác nhận, quý khách vui lòng nhìn thẳng vào camera và
              hạn chế di chuyển.
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
                Hủy
              </AlertDialogCancel>
              <Button
                onClick={captureAndUpload}
                disabled={isConfirmed || isProcessing}
                className="bg-lavender text-white font-semibold hover:bg-lavender/90 py-6 px-8 text-xl border shadow-sm rounded-xl"
              >
                Xác nhận
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default ScanCCCD;
