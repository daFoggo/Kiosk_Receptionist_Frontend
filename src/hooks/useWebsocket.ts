import { useRef, useCallback, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import debounce from 'lodash/debounce';

enum WebSocketState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

export interface WebcamData {
  nums_of_people: number;
  person_datas: Array<{
    role?: string;
  }>;
}

export interface CCCDData {
  [key: string]: string;
}

interface UseWebSocketProps {
  webSocketUrl: string;
  cameraRef: React.RefObject<Webcam>;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  webcamData: WebcamData;
  cccdData: CCCDData;
  currentRole: string;
}

export const useWebSocket = ({ webSocketUrl, cameraRef }: UseWebSocketProps): UseWebSocketReturn => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const frameIntervalRef = useRef<NodeJS.Timeout>();

  const [isConnected, setIsConnected] = useState(false);
  const [webcamData, setWebcamData] = useState<WebcamData>({
    nums_of_people: 0,
    person_datas: [],
  });
  const [cccdData, setCccdData] = useState<CCCDData>({});
  const [currentRole, setCurrentRole] = useState<string>('');

  // giảm tải lượt update webcamData
  const debouncedSetWebcamData = useCallback(
    debounce((data: WebcamData) => {
      setWebcamData(data);
    }, 500),
    []
  );

  const debouncedSetRole = useCallback(
    debounce((role: any) => {
      setCurrentRole(role);
    }, 500),
    []
  );

  
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
              const newWebcamData = data.value as WebcamData;
              debouncedSetWebcamData(newWebcamData);
              
              const newRole = newWebcamData?.person_datas[0]?.role || '';
              if (newRole !== currentRole) {
                debouncedSetRole(newRole);
              }
            }

            if (data.key === "cccd") {
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
  }, [webSocketUrl, currentRole, debouncedSetWebcamData, debouncedSetRole]);


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

      const pingInterval = setInterval(() => {
        if (wsRef.current?.readyState === WebSocketState.OPEN) {
          wsRef.current.send(JSON.stringify({ type: "ping" }));
        }
      }, 30000);

      return () => {
        clearInterval(pingInterval);
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
  }, [webSocketUrl, connectWebSocket]);

  // gui frame moi 1s
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(captureAndSendFrame, 1000);
      frameIntervalRef.current = interval;
      return () => clearInterval(interval);
    }
  }, [isConnected, captureAndSendFrame]);

  return {
    isConnected,
    webcamData,
    cccdData,
    currentRole,
  };
};