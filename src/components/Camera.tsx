import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { ipWebsocket } from "../utils/ip";
import { Tooltip, Table, ConfigProvider } from "antd";

const Camera = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const cameraRef = useRef<Webcam>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [webcamData, setWebcamData] = useState({
    nums_of_people: 0,
    person_datas: [],
  });
  console.log(webcamData);

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
    {
      title: "Vị trí",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "Phòng ban",
      dataIndex: "department",
      key: "department",
      ellipsis: true,
    },
  ];

  useEffect(() => {
    requestCameraPermission();
  }, []);

  // connect websocket
  useEffect(() => {
    if (ipWebsocket) {
      wsRef.current = new WebSocket(ipWebsocket);

      // connect
      wsRef.current.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
      };

      // disconnect
      wsRef.current.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
      };

      // receive data from server
      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data) {
            setWebcamData(data);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      return () => {
        if (wsRef.current) {
          wsRef.current.close();
        }
      };
    } else {
      console.error("WebSocket IP is not defined");
    }
  }, []);

  // send frame every 5000ms
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(captureAndSendFrame, 5000);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  const captureAndSendFrame = () => {
    if (cameraRef.current && isConnected && wsRef.current) {
      const screenshot = cameraRef.current.getScreenshot();

      if (screenshot) {
        wsRef.current.send(screenshot);
      }
      console.log("Frame sent");
    }
  };

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
            Allow Camera Access
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
          <Tooltip
            title={
              isConnected
                ? `Đã kết nối.\nSố người nhận diện được: ${webcamData.nums_of_people}`
                : "Chưa kết nối"
            }
          >
            <div
              className={`absolute top-4 right-4  w-4 h-4 rounded-full flex items-center justify-center ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            >
            </div>
          </Tooltip>
        </div>
      )}

      {webcamData.person_datas?.length > 0 && (
        <ConfigProvider
          theme={{
            components: {
              Table: {
                fontFamily: "Inter",
                headerBg: "#bcc0cc",
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
            dataSource={webcamData.person_datas}
            pagination={false}
            className="shadow-md w-full"
          />
        </ConfigProvider>
      )}
    </div>
  );
};

export default Camera;
