import LunarCalendar from "../components/LunarCalendar";
import Camera from "../components/Camera";
import EventBanner from "../components/EventBanner";
import Weather from "./Weather";
import AIModel from "../components/AIModel";
import AIChat from "../components/AIChat";
import SelectOption from "../components/SelectOption";
import { useRef } from "react";
import ScanCCCD from "../components/ScanCCCD";
import "./pageRestrictions.css";
import { ipWebsocket } from "../utils/ip";
import Webcam from "react-webcam";
import WeeklyCalendar from "@/components/WeeklyCalendar";
import Contact from "@/components/Contact";
import wavyLavender from "../assets/background_layer/lavender_wave.svg";
import { useInteraction, InteractionState } from "../hooks/useInteraction";
import { useWebSocket } from "../hooks/useWebsocket";

const Home = () => {
  const cameraRef = useRef<Webcam>(null);

  const { isConnected, webcamData, cccdData, currentRole } = useWebSocket({
    webSocketUrl: ipWebsocket,
    cameraRef,
  });

  const {
    message,
    videoPath,
    currentState,
    selectionOptions,
    isScanning,
    isContacting,
    handleRoleSelection,
    transitionToState,
  } = useInteraction({
    webcamData,
    currentRole,
  });

  const handleVerificationComplete = () => {
    transitionToState(InteractionState.CONTACT_DEPARTMENT);
  };

  const handleContactComplete = () => {
    transitionToState(InteractionState.IDLE);
  };

  const renderInteractionArea = () => {
    switch (currentState) {
      case InteractionState.GUEST_VERIFICATION:
        return (
          <ScanCCCD
            cccdData={cccdData}
            currentRole={currentRole}
            onVerificationComplete={handleVerificationComplete}
          />
        );
      case InteractionState.CONTACT_DEPARTMENT:
        return <Contact cccdData={cccdData} onContactingComplete={handleContactComplete} />;
      default:
        return (
          <div className="flex flex-col items-center gap-6">
            <Camera
              webcamData={webcamData}
              cameraRef={cameraRef}
              isConnected={isConnected}
            />
            {selectionOptions && (
              <SelectOption
                select={selectionOptions}
                onOptionSelect={handleRoleSelection}
              />
            )}
          </div>
        );
    }
  };

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
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-3">
          <LunarCalendar />
        </div>
        <div className="col-span-1">
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
        <div className="w-1/2 flex flex-col items-center aspect-video gap-6">
          <AIModel videoPath={videoPath} />
          <AIChat message={message} />
        </div>
        <div className="w-1/2">{renderInteractionArea()}</div>
      </div>
    </div>
  );
};

export default Home;
