import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { chatMockData } from "@/sampleData/chatMockData";
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
  chatMockData: any[];
  currentRole: string;
}) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // countdown quay lai va doi message
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isConfirmed && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (isConfirmed && countdown === 0) {
      setIsScanning(false);
      setCurrentVideoPath("src/assets/videos/1.mp4");
      setCurrentMessage(chatMockData[0]?.response[currentRole] || chatMockData[0]?.initialMessage);
    }
    return () => clearTimeout(timer);
  }, [isConfirmed, countdown, setIsScanning, setCurrentVideoPath, setCurrentMessage, chatMockData, currentRole]);

  const cccdFields = [
    { key: "Identity Code", label: "Mã số CCCD" },
    { key: "Name", label: "Họ và tên" },
    { key: "DOB", label: "Ngày sinh" },
    { key: "Gender", label: "Giới tính" },
    { key: "Hometown", label: "Quê quán" },
  ];

  // xac nhan thong tin va cam on
  const handleConfirm = () => {
    if (!isConfirmed) {
      setCurrentMessage(
        cccdData ? `Cảm ơn ${cccdData?.Gender === "Nam" ? "ông" : "bà"} ${
          cccdData?.Name
        } đã xác nhận thông tin`
        : "Cảm ơn quý khách đã xác nhận thông tin"
      );
      setCurrentVideoPath("src/assets/videos/quetCCCD.mp4");
      setIsConfirmed(true);
    }
  };

  const isDataComplete =
    cccdData && cccdFields.every((field) => cccdData[field.key]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto font-sans">
      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            Quý khách vui lòng đưa Căn cước công dân vào khe máy đọc bên dưới
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Thông tin</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {cccdFields.map((field) => (
            <div
              key={field.key}
              className="grid grid-cols-1 md:grid-cols-3 items-center gap-4"
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
                placeholder=""
                readOnly
              />
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="flex items-center gap-4">
        <Button
          onClick={handleConfirm}
          className="bg-lavender text-white font-semibold hover:bg-lavender/90 shadow-md"
          disabled={!isDataComplete || isConfirmed}
        >
          {isConfirmed ? `Đang trở về ${countdown}s` : "Xác nhận"}
        </Button>
      </div>
    </div>
  );
};

export default ScanCCCD;