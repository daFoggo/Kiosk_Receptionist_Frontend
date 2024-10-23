// Libraries
import {
  useEffect,
  useState,
  useRef,
  useCallback,
  useContext,
  useMemo,
} from "react";
import Webcam from "react-webcam";
import { AnimatePresence, motion } from "framer-motion";

// Components and Icons
import { IoPersonSharp } from "react-icons/io5";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

// Contexts and Hooks
import { WebSocketContext } from "@/context/WebSocketContext";

// Interfaces and utils
import { IPersonData } from "@/models/Camera/Camera";
import { convertRole } from "@/utils/helper/convertRole";

const Camera = () => {
  // Refs
  const isInitializedRef = useRef(false);
  const cameraRef = useRef<Webcam>(null);
  
  // States
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [displayedPersons, setDisplayedPersons] = useState<IPersonData[]>([]);

  // Contexts
  const { isConnected, sendFrame, webcamData } = useContext(WebSocketContext);

  // Effects
  useEffect(() => {
    requestCameraPermission();
  }, []);
  
  // Initialize camera frame capture after camera is ready
  useEffect(() => {
    if (
      !isConnected ||
      !cameraRef.current ||
      !hasPermission ||
      isInitializedRef.current
    )
      return;

    isInitializedRef.current = true;
    
    // Start capture
    const screenshot = cameraRef.current.getScreenshot();
    if (screenshot) {
      sendFrame(screenshot);
    }

    const interval = setInterval(() => {
      const screenshot = cameraRef.current?.getScreenshot();
      if (screenshot) {
        sendFrame(screenshot);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [isConnected, sendFrame, hasPermission]);

  // Update displayed persons when new data is received
  useEffect(() => {
    if (webcamData?.person_datas) {
      const newPersons = webcamData.person_datas as IPersonData[];

      setDisplayedPersons((prevPersons) => {
        const existingIds = new Set(prevPersons.map((p) => p.cccd));
        // Filter out existing persons
        const newUniquePersons = newPersons.filter(
          (person) => !existingIds.has(person.cccd)
        );

        if (newUniquePersons.length === 0) return prevPersons;
        return [...prevPersons, ...newUniquePersons];
      });
    }

    return () => {
      setDisplayedPersons([]);
    };
  }, [webcamData]);

  // Utilities
  // Request camera permission
  const requestCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setHasPermission(true);
    } catch (error) {
      console.error("Error requesting camera permission:", error);
      setHasPermission(false);
    }
  };

  const getPersonKey = useCallback((person: IPersonData) => {
    return `person-${person.cccd || ""}-${person.name || ""}-${
      person.role || ""
    }`;
  }, []);

  // Memoized components
  const personBadges = useMemo(() => {
    return displayedPersons.map((person: IPersonData) => (
      <motion.div
        key={getPersonKey(person)}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
      >
        <Badge variant="secondary" className="p-1 pr-3">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarFallback>
              <IoPersonSharp />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-xs font-semibold">{person.name}</span>
            <span className="text-[0.6rem] text-overlay">
              {convertRole(person.role || "")}
            </span>
          </div>
        </Badge>
      </motion.div>
    ));
  }, [displayedPersons, getPersonKey]);

  const CameraSkeleton = () => (
    <div className="w-full">
      <Skeleton className="w-full h-auto rounded-2xl aspect-video" />
    </div>
  );

  return (
    <div className="relative flex flex-col items-center justify-center gap-6 w-full">
      {hasPermission === null || hasPermission === false ? (
        <CameraSkeleton />
      ) : (
        <div className="relative">
          <Webcam
            ref={cameraRef}
            mirrored
            screenshotFormat="image/jpeg"
            className="rounded-2xl w-full"
            onUserMediaError={() => setHasPermission(false)}
          />
          <Badge className="absolute top-4 right-4 flex items-center gap-2 text-lg font-semibold text-white backdrop-blur-md bg-surface2 hover:bg-surface2/50 border border-white/50 px-3 py-1.5 rounded-full">
            <IoPersonSharp className="text-center" />
            <p>{webcamData?.nums_of_people || 0}</p>
            <div
              className={`w-4 h-4 ${
                isConnected ? "bg-green-500" : "bg-red-500"
              } rounded-full`}
            ></div>
          </Badge>
        </div>
      )}
      <div className="w-full flex flex-wrap gap-2">
        <AnimatePresence mode="popLayout">{personBadges}</AnimatePresence>
      </div>
    </div>
  );
};

export default Camera;
