import { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Badge } from "./ui/badge";
import { IoPersonSharp } from "react-icons/io5";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

import { Skeleton } from "@/components/ui/skeleton";

const Camera = ({
  isConnected,
  webcamData,
  cameraRef,
}: {
  setCurrentRole: (role: string) => void;
  setIsScanning: (value: boolean) => void;
  webcamData: any;
  cameraRef: any;
  isConnected: boolean;
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const columns = [
    {
      title: "Họ tên",
      key: "name",
    },
    {
      title: "Chức vụ",
      key: "role",
    },
  ];

  useEffect(() => {
    requestCameraPermission();
  }, []);

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

  console.log(webcamData);

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
            className="rounded-2xl shadow-md w-full"
            onUserMediaError={() => setHasPermission(false)}
          />

          <Badge className="bg-base text-lg text-sub-text1 font-semibold gap-2 absolute top-4 right-4 flex items-center">
            <IoPersonSharp className="text-center" />
            <p>{webcamData.nums_of_people}</p>

            <div
              className={`w-4 h-4 ${
                isConnected ? "bg-green-500" : "bg-red-500"
              } rounded-full`}
            ></div>
          </Badge>
        </div>
      )}
      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-base rounded-3xl">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className="font-bold text-lg text-heading text-left"
                >
                  {column.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        </Table>
        <div className="max-h-[calc(2*3rem)] overflow-y-auto">
          <Table>
            <TableBody>
              {webcamData?.person_datas?.map((person: any, index: any) => (
                <TableRow key={index}>
                  <TableCell>{person.name}</TableCell>
                  <TableCell>{person.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Camera;
