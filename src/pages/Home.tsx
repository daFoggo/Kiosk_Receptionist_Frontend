import LunarCalendar from "../components/LunarCalendar";
import Camera from "../components/Camera";
import EventBanner from "../components/EventBanner";
import Weather from "../components/Weather";
import AIModel from "../components/AIModel";
import AIChat from "../components/AIChat";
import SelectOption from "../components/SelectOption";
import { chatMockData } from "../sampleData/chatMockData";
import { useEffect, useState } from "react";
import { SelectOptionProps } from "../types/ChatMockData";
import ScanCCCD from "../components/ScanCCCD";
import "./pageRestrictions.css";

const Home = () => {
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);
  const [currentVideoPath, setCurrentVideoPath] = useState<string>("");
  const [currentSelect, setCurrentSelect] = useState<SelectOptionProps>({
    question: "",
    options: [],
    video_path: "",
  });
  const [currentRole, setCurrentRole] = useState<string>("");

  console.log(currentVideoPath);

  useEffect(() => {
    const disableZoom = (e) => {
      if (e.ctrlKey && (e.key === "+" || e.key === "-")) {
        e.preventDefault();
      }
    };

    const disableRightClick = (e) => {
      e.preventDefault();
    };

    const disableScroll = (e) => {
      e.preventDefault();
    };

    document.addEventListener("keydown", disableZoom);
    document.addEventListener("contextmenu", disableRightClick);
    document.addEventListener("wheel", disableScroll, { passive: false });

    return () => {
      document.removeEventListener("keydown", disableZoom);
      document.removeEventListener("contextmenu", disableRightClick);
      document.removeEventListener("wheel", disableScroll);
    };
  }, []);

  useEffect(() => {
    setCurrentMessage(chatMockData[0].initialMessage);
    setCurrentVideoPath(chatMockData[0].video_path);
    setCurrentSelect(chatMockData[0].select);
  }, []);

  useEffect(() => {
    if (currentRole) {
      setCurrentMessage(chatMockData[0].response[currentRole] || chatMockData[0].initialMessage);
      setCurrentVideoPath(chatMockData[0].response_path[currentRole] || chatMockData[0].video_path);
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

  const handleSetCurrentVideoPath = (value: string) => {
    setCurrentVideoPath(value);
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
          <AIModel videoPath={currentVideoPath}/>
          <AIChat message={currentMessage}></AIChat>
        </div>

        {/* camera */}
        {isScanning ? (
          <ScanCCCD
            setIsScanning={handleSetIsScanning}
            setCurrentMessage={handleSetCurrentMessage}
          />
        ) : (
          <div className="w-1/2 flex flex-col items-center gap-6">
            <Camera setCurrentRole={handleSetCurrentRole} />
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
