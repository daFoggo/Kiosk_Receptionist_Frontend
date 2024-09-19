import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Table, ConfigProvider } from "antd";
import { Badge } from "./ui/badge";
import { IoPersonSharp } from "react-icons/io5";

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
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Chức vụ",
      dataIndex: "role",
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

  return (
    <div className="relative flex flex-col items-center justify-center gap-6">
      {hasPermission === null ? (
        <p>Requesting camera permission...</p>
      ) : hasPermission === false ? (
        <div className="flex flex-col items-center">
          <p>Cần cấp quyền truy cập camera</p>
          <button
            onClick={requestCameraPermission}
            className="mt-2 px-4 py-2 bg-lavender text-white rounded-2xl"
          >
            Cho phép truy cập camera
          </button>
        </div>
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

      <ConfigProvider
        theme={{
          components: {
            Table: {
              fontFamily: "Inter",
              headerBg: "#eff1f5",
              fontSize: 14,
              colorPrimary: "#7287fd",
            },
            Button: {
              colorPrimary: "#7287fd",
              algorithm: true,
            },
          },
        }}
      >
        <Table
          columns={columns}
          dataSource={webcamData.person_datas?.map((person: any, index: any) => ({
            ...(person as object),
            key: index,
          }))}
          pagination={false}
          className="shadow-md w-full custom-height"
          scroll={{ y: 100 }}
        />
      </ConfigProvider>
    </div>
  );
};

export default Camera;
