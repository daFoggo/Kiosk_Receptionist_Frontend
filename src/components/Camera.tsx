import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { ipWebsocket } from "../utils/ip";
import { Tooltip } from "antd";

const Camera = () => {
  const cameraRef = useRef<Webcam>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [numberOfPersons, setNumberOfPersons] = useState(null);

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

      // nhan du lieu tu server
      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.nums_of_people) {
            setNumberOfPersons(data.nums_of_people);
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

  // gui frame moi 500ms
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(captureAndSendFrame, 500);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  const captureAndSendFrame = () => {
    if (cameraRef.current && isConnected && wsRef.current) {
      const screenshot = cameraRef.current.getScreenshot();

      if (screenshot) {
        wsRef.current.send(screenshot);
      }
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="relative">
        <Webcam
          ref={cameraRef}
          mirrored
          screenshotFormat="image/jpeg"
          className="rounded-2xl"
        />
        <Tooltip title={isConnected ? "Đã kết nối" : "Chưa kết nối"}>
          <div
            className={`absolute top-4 right-4  w-4 h-4 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
        </Tooltip>
      </div>
      <p className="mt-2 text-3xl">
        Number of persons detected:{" "}
        {numberOfPersons !== null ? numberOfPersons : "Loading..."}
      </p>
    </div>
  );
};

export default Camera;
