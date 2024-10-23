// Library
import { createContext, useRef, useState, useCallback, useEffect } from "react";

// Interface and utils
import {
  IWebSocketContext,
  IWebSocketProviderProps,
} from "@/models/WebSocketContext/WebSocketContext";
import { IWebcamData } from "@/models/Camera/Camera";

// WebSocket connection states
enum WebSocketState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

export const WebSocketContext = createContext<IWebSocketContext>({
  isConnected: false,
  webcamData: { nums_of_people: 0, person_datas: [] },
  cccdData: {},
  currentRole: "",
  currentCccd: "",
  sendFrame: () => {},
  resetCccdData: () => {},
});

export const WebSocketProvider = ({
  children,
  webSocketUrl,
}: IWebSocketProviderProps) => {
  // Refs
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttempts = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;

  // States
  const [isConnected, setIsConnected] = useState(false);
  const [webcamData, setWebcamData] = useState({
    nums_of_people: 0,
    person_datas: [],
  });
  const [cccdData, setCccdData] = useState({});
  const [currentRole, setCurrentRole] = useState<string>("");
  const [currentCccd, setCurrentCccd] = useState<string>("");

  // Handlers
  // Update current role and cccd when new webcam data is received
  const updatePersonData = useCallback((newWebcamData: IWebcamData) => {
    const personData = newWebcamData?.person_datas || [];
    
    if (personData.length > 0) {
      const newRole = personData[0]?.role;
      const newCccd = personData[0]?.cccd;

      setCurrentRole((prev) => {
        if (prev !== newRole && newRole) return newRole;
        return prev;
      });

      setCurrentCccd((prev) => {
        if (prev !== newCccd && newCccd) return newCccd;
        return prev;
      });
    } else {
      setCurrentRole("");
      setCurrentCccd("");
    }
  }, []);

  // Connect to WebSocket server, send and receive data
  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocketState.OPEN) {
      console.log("WebSocket already connected");
      return;
    }

    try {
      wsRef.current = new WebSocket(webSocketUrl);

      wsRef.current.onopen = () => {
        console.log("WebSocket connected successfully");
        setIsConnected(true);
        reconnectAttempts.current = 0;
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Two typess of data: webcam and cccd
          if (data) {
            
            if (data.key === "webcam") {
              const newWebcamData = data.value;
              if (newWebcamData) {
                setWebcamData(newWebcamData);
                updatePersonData(newWebcamData);
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

      wsRef.current.onclose = () => {
        console.log("WebSocket connection closed");
        setIsConnected(false);
        
        // Attempt to reconnect
        if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts.current += 1;
          reconnectTimeoutRef.current = setTimeout(connectWebSocket, 1000 * Math.pow(2, reconnectAttempts.current));
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        if (wsRef.current) {
          wsRef.current.close();
        }
      };
    } catch (error) {
      console.error("Error creating WebSocket connection:", error);
    }
  }, [webSocketUrl, updatePersonData]);

  // Utilities
  // Send frame data to WebSocket server
  const sendFrame = useCallback((frameData: string) => {
    if (wsRef.current?.readyState === WebSocketState.OPEN) {
      wsRef.current.send(frameData);
    } else {
      console.warn("WebSocket is not connected. Attempting to reconnect...");
      connectWebSocket();
    }
  }, [connectWebSocket]);

  const resetCccdData = useCallback(() => {
    setCccdData({});
    setCurrentCccd("");
  }, []);

  // Start connect when mounted
  useEffect(() => {
    if (webSocketUrl) {
      connectWebSocket();
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
      setIsConnected(false);
      setWebcamData({ nums_of_people: 0, person_datas: [] });
      setCccdData({});
      setCurrentRole("");
      setCurrentCccd("");
    };
  }, [webSocketUrl, connectWebSocket]);

  const value = {
    isConnected,
    webcamData,
    cccdData,
    currentRole,
    currentCccd,
    sendFrame,
    resetCccdData,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};