"use client"
import { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { IoPersonSharp } from "react-icons/io5";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from "framer-motion";
import { IWebcamData } from "@/models/Home/Home";
import { ICameraProps } from "@/models/Camera/Camera";

const Camera = ({ isConnected, webcamData, cameraRef }: ICameraProps) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [localWebcamData, setLocalWebcamData] =
    useState<IWebcamData>(webcamData);

  useEffect(() => {
    requestCameraPermission();
  }, []);
  useEffect(() => {
    setLocalWebcamData(webcamData);
  }, [webcamData]);

  const requestCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setHasPermission(true);
    } catch (error) {
      console.error("Error requesting camera permission:", error);
      setHasPermission(false);
    }
  };

  const CameraSkeleton = () => (
    <div className="w-full">
      <Skeleton className="w-full h-auto rounded-2xl aspect-video" />
    </div>
  );

  const convertRole = (role: string) => {
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

  return (
    <div className="relative flex flex-col items-center justify-center gap-6 w-full">
      {hasPermission === null || hasPermission === false ? (
        <CameraSkeleton />
      ) : (
        <div className="relative">
          <Webcam
            ref={cameraRef}
            mirrored
            screenshotFormat="image/jpeg"
            className="rounded-2xl  w-full"
            onUserMediaError={() => setHasPermission(false)}
          />

          <Badge className="absolute top-4 right-4 flex items-center gap-2 text-lg font-semibold text-white backdrop-blur-md bg-surface2 hover:bg-surface2/50 border border-white/50 px-3 py-1.5 rounded-full">
            <IoPersonSharp className="text-center" />
            <p>{localWebcamData?.nums_of_people}</p>

            <div
              className={`w-4 h-4 ${
                isConnected ? "bg-green-500" : "bg-red-500"
              } rounded-full`}
            ></div>
          </Badge>
        </div>
      )}
      <div className="w-full flex flex-wrap gap-2">
        <AnimatePresence>
          {localWebcamData?.person_datas?.map((person: any, index: any) => (
            <motion.div
              key={person.cccd || index}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Badge variant="secondary" className="p-1 pr-3">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarFallback>
                    <IoPersonSharp />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-semibold">{person.name}</span>
                  <span className="text-[0.6rem] text-overlay">
                    {convertRole(person.role || "")}
                  </span>
                </div>
              </Badge>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Camera;
