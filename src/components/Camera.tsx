import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { ipWebsocket } from "../utils/ip";

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
    <div className="flex flex-col items-center justify-center">
      <Webcam
        ref={cameraRef}
        mirrored
        screenshotFormat="image/jpeg"
        className="rounded-md w-4/5 h-auto"
      />
      <p className="mt-4">
        Status: {isConnected ? 'Connected' : 'Disconnected'}
      </p>
      <p className="mt-2">
        Number of persons detected: {numberOfPersons !== null ? numberOfPersons : 'Loading...'}
      </p>
    </div>
  );
};

export default Camera;