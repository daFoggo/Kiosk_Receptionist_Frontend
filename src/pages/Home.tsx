import LunarCalendar from "../components/LunarCalendar";
import Camera from "../components/Camera";
import EventBanner from "../components/EventBanner";
import Weather from "./Weather";
import AIModel from "../components/AIModel";
import AIChat from "../components/AIChat";
import SelectOption from "../components/SelectOption";
import { chatMockData } from "../sampleData/chatMockData";
import { useEffect, useState, useRef, useCallback } from "react";
import { SelectOptionProps } from "../types/ChatMockData";
import ScanCCCD from "../components/ScanCCCD";
import "./pageRestrictions.css";
import { ipWebsocket } from "../utils/ip";
import Webcam from "react-webcam";
import WeeklyCalendar from "@/components/WeeklyCalendar";
import Contact from "@/components/Contact";
import wavyLavender from "../assets/background_layer/lavender_wave.svg";
import { useDisableScroll } from "../utils/disableScroll";

enum WebSocketState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

const Home = () => {
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isContacting, setIsContacting] = useState(false);
  const [currentVideoPath, setCurrentVideoPath] = useState<string>("");
  const [cccdData, setCccdData] = useState<Record<string, string> | null>(null);
  const [currentSelect, setCurrentSelect] = useState<SelectOptionProps>({
    question: "",
    options: [],
    video_path: "src/assets/videos/default.mp4",
  });
  const [currentRole, setCurrentRole] = useState<string>("");
  const [webcamData, setWebcamData] = useState({
    nums_of_people: 0,
    person_datas: [],
  });

  const wsRef = useRef<WebSocket | null>(null);
  const cameraRef = useRef<Webcam>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const frameIntervalRef = useRef<NodeJS.Timeout>();

  const connectWebSocket = useCallback(() => {
    try {
      if (wsRef.current?.readyState === WebSocketState.OPEN) {
        console.log("WebSocket already connected");
        return;
      }

      wsRef.current = new WebSocket(ipWebsocket);

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

        // Clear existing timeout if any
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }

        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data) {
            if (data.key === "webcam") {
              setWebcamData(data?.value);
              setCurrentRole(data?.value?.person_datas[0]?.role);
            }

            if (data.key === "cccd") {
              setCccdData(JSON.parse(data?.value));
              setCurrentMessage(
                "Cảm ơn quý khách đã xuất trình Căn cước công dân. Quý khách vui lòng cung cấp thêm hình ảnh và xác nhận thông tin"
              );
              setCurrentVideoPath("src/assets/videos/khach2.mp4");
              setIsScanning(true);
            }
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
    } catch (error) {
      console.error("Error creating WebSocket connection:", error);
    }
  }, []);

  useEffect(() => {
    if (ipWebsocket) {
      connectWebSocket();

      // Implement ping mechanism
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
      console.error("WebSocket IP is not defined");
    }
  }, [connectWebSocket]);

  // gui frame moi 2s
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(captureAndSendFrame, 1500);
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

  // default message
  useEffect(() => {
    setCurrentMessage(chatMockData[0].initialMessage);
    setCurrentVideoPath(chatMockData[0].video_path);
    setCurrentSelect(chatMockData[0].select);
  }, []);

  const handleOptionSelect = (selectedValue: string) => {
    const responseMessage = chatMockData[0]?.response[selectedValue];
    const responseVideoPath = chatMockData[0]?.response_path[selectedValue];
    setCurrentMessage(responseMessage);
    setCurrentVideoPath(responseVideoPath);
  };

  const handleSetCurrentRole = (role: string) => {
    setCurrentRole(role);
  };

  const handleSetIsScanning = (value: boolean) => {
    setIsScanning(value);
  };

  const handleSetIsContacting = (value: boolean) => {
    setIsContacting(value);
  };

  const handleSetCurrentMessage = (value: string) => {
    setCurrentMessage(value);
  };

  // disable mot so thao tac

  return (
    <div className="flex flex-col gap-6 px-6 py-3 page-restrictions relative overflow-hidden h-screen">
      {/* background */}
      <div
        className="absolute inset-x-0 bottom-0 -z-10"
        style={{
          backgroundImage: `url(${wavyLavender})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom",
          backgroundSize: "100% auto",
          height: "100%",
          bottom: "50px",
        }}
      />

      {/* calendar and weather */}
      <div className="flex flex-row gap-6">
        <div className="w-3/4">
          <LunarCalendar />
        </div>
        <div>
          <Weather />
        </div>
      </div>

      {/* banner */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <EventBanner />
        </div>
        <div className="col-span-1">
          <WeeklyCalendar />
        </div>
      </div>

      {/* main section */}
      <div className="flex flex-row gap-6 h-1/2">
        {/* AI model */}
        <div className="w-1/2 flex flex-col items-center aspect-video gap-6">
          <AIModel videoPath={currentVideoPath} />
          <AIChat message={currentMessage}></AIChat>
        </div>

        {/* camera */}
        {isScanning ? (
          <div className="w-1/2">
            <ScanCCCD
              setIsScanning={handleSetIsScanning}
              setIsContacting={handleSetIsContacting}
              setCurrentMessage={handleSetCurrentMessage}
              cccdData={cccdData}
              setCurrentVideoPath={setCurrentVideoPath}
              currentRole={currentRole}
            />
          </div>
        ) : isContacting ? (
          <div className="w-1/2">
            <Contact
              cccdData={cccdData}
              setIsScanning={setIsScanning}
              setIsContacting={setIsContacting}
              setCurrentMessage={handleSetCurrentMessage}
            />
          </div>
        ) : (
          <div className="w-1/2 flex flex-col items-center gap-6">
            <Camera
              setCurrentRole={handleSetCurrentRole}
              setIsScanning={handleSetIsScanning}
              webcamData={webcamData}
              cameraRef={cameraRef}
              isConnected={isConnected}
            />
            <SelectOption
              select={currentSelect}
              onOptionSelect={handleOptionSelect}
              setIsScanning={handleSetIsScanning}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
