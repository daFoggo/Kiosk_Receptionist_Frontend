import { useState, useEffect, useRef } from "react";

const AIModel = ({ videoPath }: { videoPath: string }) => {
  const [currentVideo, setCurrentVideo] = useState(videoPath || "src/assets/videos/1.mp4");
  const [nextVideo, setNextVideo] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (videoPath !== currentVideo) {
      setNextVideo(videoPath);
      setIsTransitioning(true);
    }
  }, [videoPath]);

  const handleTransitionEnd = () => {
    setCurrentVideo(nextVideo);
    setNextVideo("");
    setIsTransitioning(false);
  };

  return (
    <div className="bg-base_bg rounded-2xl relative overflow-hidden aspect-[9/16] h-[80%] w-full font-sans ">
      <video
        key={currentVideo}
        src={currentVideo}
        className="absolute inset-0 w-full h-full object-cover bg-center"
        autoPlay
        playsInline
        muted
      />
      {isTransitioning && (
        <video
          key={nextVideo}
          src={nextVideo}
          className="absolute inset-0 w-full h-full object-cover bg-center opacity-0 transition-opacity duration-1000"
          autoPlay
          playsInline
          onCanPlay={(e) => {
            e.currentTarget.classList.remove("opacity-0");
          }}
          muted
          onTransitionEnd={handleTransitionEnd}
        />
      )}
    </div>
  );
};

export default AIModel;