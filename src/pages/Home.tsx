import LunarCalendar from "../components/LunarCalendar";
import Camera from "../components/Camera";
import EventBanner from "../components/EventBanner";
import Weather from "../components/Weather";
import AIModel from "../components/AIModel";
import AIChat from "../components/AIChat";
import SelectOption from "../components/SelectOption";
import { chatMockData } from "../sampleData/chatMockData";
import { useEffect, useState, useRef } from "react";
import { SelectOptionProps } from "../types/ChatMockData";
import ScanCCCD from "../components/ScanCCCD";
import "./pageRestrictions.css";
import { ipWebsocket } from "../utils/ip";
import Webcam from "react-webcam";

const Home = () => {
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [currentVideoPath, setCurrentVideoPath] = useState<string>("");
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
  const [cccdData, setCccdData] = useState<Record<string, string> | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const cameraRef = useRef<Webcam>(null);

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
            if (data.key === "webcam") {
              setWebcamData(data?.value);
              setCurrentRole(data?.value?.person_datas[0]?.role);
            }

            if (data.key === "cccd") {
              setCccdData(JSON.parse(data?.value));
              setIsScanning(true);
            }
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

  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(captureAndSendFrame, 2000);
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

  useEffect(() => {
    const disableZoom = (e: any) => {
      if (e.ctrlKey && (e.key === "+" || e.key === "-")) {
        e.preventDefault();
      }
    };

    const disableRightClick = (e: any) => {
      e.preventDefault();
    };

    const disableScroll = (e: any) => {
      e.preventDefault();
    };

    const disableTouchScroll = (e: any) => {
      e.preventDefault();
    };

    document.addEventListener("keydown", disableZoom);
    document.addEventListener("contextmenu", disableRightClick);
    document.addEventListener("wheel", disableScroll, { passive: false });
    document.addEventListener("touchmove", disableTouchScroll, {
      passive: false,
    });

    return () => {
      document.removeEventListener("keydown", disableZoom);
      document.removeEventListener("contextmenu", disableRightClick);
      document.removeEventListener("wheel", disableScroll);
      document.removeEventListener("touchmove", disableTouchScroll);
    };
  }, []);

  useEffect(() => {
    setCurrentMessage(chatMockData[0].initialMessage);
    setCurrentVideoPath(chatMockData[0].video_path);
    setCurrentSelect(chatMockData[0].select);
  }, []);

  useEffect(() => {
    if (currentRole) {
      setCurrentMessage(
        chatMockData[0].response[currentRole] || chatMockData[0].initialMessage
      );
      setCurrentVideoPath(
        chatMockData[0].response_path[currentRole] || chatMockData[0].video_path
      );
    }
  }, [currentRole]);

  const handleOptionSelect = (selectedValue: string) => {
    const responseMessage = chatMockData[0].response[selectedValue];
    const responseVideoPath = chatMockData[0].response_path[selectedValue];
    setCurrentMessage(responseMessage);
    setCurrentVideoPath(responseVideoPath);
  };

  const handleSetCurrentRole = (role: string) => {
    setCurrentRole(role);
  };

  const handleSetIsScanning = (value: boolean) => {
    setIsScanning(value);
  };

  const handleSetCurrentMessage = (value: string) => {
    setCurrentMessage(value);
  };

  return (
    <div className="flex flex-col gap-6 px-6 py-3 h-screen page-restrictions">
      {/* banner */}
      <div className="h-auto">
        <EventBanner />
      </div>

      {/* calendar and weather */}
      <div className="flex flex-row gap-6">
        <div className="w-3/4">
          <LunarCalendar />
        </div>
        <div>
          <Weather />
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
          <ScanCCCD
            setIsScanning={handleSetIsScanning}
            setCurrentMessage={handleSetCurrentMessage}
            cccdData={cccdData}
            setCurrentVideoPath={setCurrentVideoPath}
          />
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
