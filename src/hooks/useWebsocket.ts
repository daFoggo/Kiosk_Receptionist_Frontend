import {
  ICCCDData,
  IUseWebSocketProps,
  IUseWebSocketReturn,
  IWebcamData,
} from "@/models/Home/Home";
import { useRef, useCallback, useEffect, useState } from "react";

enum WebSocketState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

export const useWebSocket = ({
  webSocketUrl,
  cameraRef,
}: IUseWebSocketProps): IUseWebSocketReturn => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const frameIntervalRef = useRef<NodeJS.Timeout>();

  const [isConnected, setIsConnected] = useState(false);
  const [webcamData, setWebcamData] = useState<IWebcamData>({
    nums_of_people: 0,
    person_datas: [],
  });
  const [cccdData, setCccdData] = useState<ICCCDData>({});
  const [currentRole, setCurrentRole] = useState<string>("");
  const [currentCccd, setCurrentCccd] = useState<string>("");

  // connect ws
  const connectWebSocket = useCallback(() => {
    try {
      if (wsRef.current?.readyState === WebSocketState.OPEN) {
        console.log("WebSocket already connected");
        return;
      }

      wsRef.current = new WebSocket(webSocketUrl);

      wsRef.current.onopen = () => {
        console.log("WebSocket connected successfully");
        setIsConnected(true);
      };

      wsRef.current.onclose = (event) => {
        console.error("WebSocket closed", {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
        });
        setIsConnected(false);

        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }

        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      // listen event
      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data) {
            if (data.key === "webcam") {
              const newWebcamData = data.value as IWebcamData;
              if (newWebcamData) {
                setWebcamData(newWebcamData);
              }

              const newRole = newWebcamData?.person_datas[0]?.role || "";
              const newCccd = newWebcamData?.person_datas[0]?.cccd || "";
              if (newRole !== currentRole || currentRole === null) {
                setCurrentRole(newRole);
              }
              if (newCccd !== currentCccd || currentCccd === null) {
                setCurrentCccd(newCccd);
              }
            }

            if (data.key === "cccd") {
              console.log(data.value);
              setCccdData(JSON.parse(data.value));
            }
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
    } catch (error) {
      console.error("Error creating WebSocket connection:", error);
    }
  }, [webSocketUrl, currentRole, currentCccd]);

  const captureAndSendFrame = useCallback(() => {
    if (cameraRef.current && isConnected && wsRef.current) {
      const screenshot = cameraRef.current.getScreenshot();
      if (screenshot) {
        wsRef.current.send(screenshot);
        console.log("Frame sent");
      }
    }
  }, [cameraRef, isConnected]);

  useEffect(() => {
    if (webSocketUrl) {
      connectWebSocket();

      // const pingInterval = setInterval(() => {
      //   if (wsRef.current?.readyState === WebSocketState.OPEN) {
      //     wsRef.current.send(JSON.stringify({ type: "ping" }));
      //   }
      // }, 30000);

      return () => {
        // clearInterval(pingInterval);
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        if (frameIntervalRef.current) {
          clearInterval(frameIntervalRef.current);
        }
        if (wsRef.current) {
          wsRef.current.close();
        }
      };
    } else {
      console.error("WebSocket URL is not defined");
    }
  }, []);

  const resetCccdData = useCallback(() => {
    setCccdData({});
    setCurrentCccd("");
  }, []);

  // gui frame moi 3s
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(captureAndSendFrame, 1500);
      frameIntervalRef.current = interval;
      return () => clearInterval(interval);
    }
  }, [isConnected, captureAndSendFrame]);

  return {
    isConnected,
    webcamData,
    cccdData,
    currentRole,
    currentCccd,
    resetCccdData,
  };
};
