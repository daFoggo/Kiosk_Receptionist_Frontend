import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
import { CCCDData } from "@/hooks/useWebsocket";
import axios from "axios";
import { toast } from "sonner";
import Webcam from "react-webcam";
import { ipUploadData } from "@/utils/ip";
import iconCCCD from "../assets/icon/iconCCCD.png";

interface ScanCCCDProps {
  cccdData: CCCDData;
  currentRole: string;
  onVerificationComplete: () => void;
  webcamRef: React.RefObject<Webcam>;
}

const ScanCCCD = ({
  cccdData,
  currentRole,
  onVerificationComplete,
  webcamRef,
}: ScanCCCDProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [selectedRole, setSelectedRole] = useState(currentRole);

  const cccdFields = [
    { key: "Identity Code", label: "Mã số CCCD" },
    { key: "Name", label: "Họ và tên" },
    { key: "DOB", label: "Ngày sinh" },
    { key: "Gender", label: "Giới tính" },
  ];

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
          },
          role: selectedRole,
        };

        await axios.post(ipUploadData, formattedData);
        onVerificationComplete();
        toast.success("Đã xác nhận thông tin thành công");
      }
    } catch (error) {
      console.error("Error processing and uploading data:", error);
      toast.error("Có lỗi trong quá trình xác nhận thông tin");
    } finally {
      setIsProcessing(false);
      setIsDialogOpen(false);
    }
  };

  const isDataComplete =
    cccdData && cccdFields.every((field) => cccdData[field.key]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto font-sans">
      <Card className="w-full rounded-2xl border shadow-sm flex flex-row items-center justify-between gap-2 p-4">
        <img src={iconCCCD} alt="" className="w-16 bg-base rounded-lg p-2" />
        <h1 className="font-semibold text-justify">
          Quý khách vui lòng đưa Căn cước công dân vào khe máy đọc bên dưới
        </h1>
      </Card>

      <Card className="w-full rounded-2xl border shadow-sm">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-heading">
            Thông tin
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 w-full">
            <Label htmlFor="role" className="text-right font-semibold text-xl md:col-span-1">
              Vai trò
            </Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="md:col-span-2 bg-crust text-base-content">
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="STUDENT">Sinh viên</SelectItem>
                <SelectItem value="STAFF">Cán bộ</SelectItem>
                <SelectItem value="EVENT_GUEST">Khách mời sự kiện</SelectItem>
                <SelectItem value="GUEST">Khách</SelectItem>
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
                className="md:col-span-2 bg-crust text-base-content"
                value={cccdData?.[field.key] || ""}
                readOnly
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button
            className="w-full bg-lavender text-white font-semibold hover:bg-lavender/90 py-6 px-8 text-xl border shadow-sm rounded-xl"
            disabled={!isDataComplete || isProcessing || selectedRole === ""}
            onClick={() => setIsDialogOpen(true)}
          >
            Xác nhận
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
              disabled={isProcessing}
              className="bg-lavender text-white font-semibold hover:bg-lavender/90 py-6 px-8 text-xl border shadow-sm rounded-xl"
            >
              {isProcessing
                ? `Đang xử lý thông tin ${processProgress}%`
                : "Xác nhận"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ScanCCCD;