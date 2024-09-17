import { useState, useEffect, useRef } from "react";
import { ipStream } from "@/utils/ip";

const AIModel = ({ videoPath }: { videoPath: string }) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [imageData, setImageData] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);

  // useEffect(() => {
  //   if (ipStream) {
  //     wsRef.current = new WebSocket(ipStream);

  //     // connect
  //     wsRef.current.onopen = () => {
  //       console.log("Stream connected");
  //       setIsConnected(true);
  //       sendCommand("1");
  //     };

  //     // disconnect
  //     wsRef.current.onclose = () => {
  //       console.log("Stream disconnected");
  //       setIsConnected(false);
  //     };

  //     // receive data from server
  //     wsRef.current.onmessage = (event) => {
  //       try {
  //         const data = event.data;
  //         if (data instanceof Blob) {
  //           const reader = new FileReader();
  //           reader.onloadend = () => {
  //             const base64Data = reader.result as string;
  //             setImageData(base64Data);
  //             console.log(base64Data);
  //           };
  //           reader.readAsDataURL(data);
  //         } else {
  //           console.error("Received data is not a Blob");
  //         }
  //       } catch (error) {
  //         console.error("Error processing WebSocket message:", error);
  //       }
  //     };

  //     return () => {
  //       if (wsRef.current) {
  //         wsRef.current.close();
  //       }
  //     };
  //   } else {
  //     console.error("WebSocket IP is not defined");
  //   }
  // }, []);

  // const sendCommand = (command: string) => {
  //   if (isConnected && wsRef.current) {
  //     wsRef.current.send(command);
  //   }
  // };

  return (
    <div className="bg-base_bg rounded-2xl relative overflow-hidden aspect-[9/16] h-[80%] w-full font-sans shadow-md">
      {/* Video Background */}
      {videoPath ? (
        <video
          key={videoPath}
          src={videoPath}
          className="absolute inset-0 w-full h-full object-cover bg-center"
          autoPlay
          muted
          playsInline
        ></video>
      ) : (
        <video
          key={"default"}
          src={"src/assets/videos/1.mp4"}
          className="absolute inset-0 w-full h-full object-cover bg-center"
          autoPlay
          muted
          playsInline
          loop
        ></video>
      )}
    </div>
  );
};

export default AIModel;
